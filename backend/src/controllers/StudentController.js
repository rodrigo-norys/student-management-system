import Student from '../models/Student.js';
import Guardian from '../models/Guardian.js';
import User from '../models/User.js';
import Address from '../models/Address.js';

import Sequelize from 'sequelize';
import database from '../database/index.js';

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

// Escapa wildcards do LIKE (% _ \) para tratá-los como literais na busca.
function escapeLike(term) {
  return String(term).replace(/[\\%_]/g, (char) => `\\${char}`);
}

class StudentController {
  // Gera a matrícula no formato AAAA + sequencial de 6 dígitos, reiniciando a
  // cada ano. O sequencial é zero-padded de largura fixa, então a ordenação
  // lexicográfica dentro do mesmo ano equivale à numérica.
  generateRegistrationNumber = async (transaction) => {
    const yearPrefix = String(new Date().getFullYear());

    const lastStudent = await Student.findOne({
      where: { registration_number: { [Sequelize.Op.like]: `${yearPrefix}%` } },
      order: [['registration_number', 'DESC']],
      attributes: ['registration_number'],
      transaction,
    });

    const lastSequence = lastStudent
      ? Number(lastStudent.registration_number.slice(yearPrefix.length))
      : 0;

    const nextSequence = String(lastSequence + 1).padStart(6, '0');
    return `${yearPrefix}${nextSequence}`;
  };

  // Identifica colisão específica de matrícula sob concorrência, para distinguir
  // de duplicidade de email/cpf (que não deve disparar retry).
  isRegistrationCollision(e) {
    return (
      e instanceof Sequelize.UniqueConstraintError &&
      Array.isArray(e.errors) &&
      e.errors.some((err) => err.path === 'registration_number')
    );
  }

  create = async (req, res) => {
    const MAX_REGISTRATION_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_REGISTRATION_RETRIES; attempt++) {
      const transaction = await database.transaction();

      try {
        const { addresses, guardian_ids, ...rawStudentData } = req.body;

        const registration_number =
          await this.generateRegistrationNumber(transaction);

        const sanitizedStudentData = {
          name: rawStudentData.name,
          last_name: rawStudentData.last_name,
          email: rawStudentData.email,
          cpf: rawStudentData.cpf,
          birth_date: rawStudentData.birth_date,
          blood_type: rawStudentData.blood_type,
          medical_notes: rawStudentData.medical_notes,
          registration_number,
          avatar_url: null,
          user_id: null,
        };

        const newStudent = await Student.create(sanitizedStudentData, {
          transaction,
        });

        if (addresses && Array.isArray(addresses) && addresses.length > 0) {
          const addressesToSave = addresses.map((address) => ({
            zip_code: address.zip_code,
            street: address.street,
            number: address.number,
            complement: address.complement,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            student_id: newStudent.id,
          }));
          await Address.bulkCreate(addressesToSave, { transaction });
        }

        if (
          guardian_ids &&
          Array.isArray(guardian_ids) &&
          guardian_ids.length > 0
        ) {
          await newStudent.setGuardians(guardian_ids, { transaction });
        }

        const fullStudent = await Student.findByPk(newStudent.id, {
          attributes: [
            'id',
            'name',
            'last_name',
            'email',
            'cpf',
            'registration_number',
            'birth_date',
            'blood_type',
            'medical_notes',
            'status',
            'avatar_url',
          ],
          include: [
            {
              model: Address,
              as: 'addresses',
              attributes: [
                'id',
                'zip_code',
                'street',
                'number',
                'complement',
                'neighborhood',
                'city',
                'state',
              ],
            },
            {
              model: Guardian,
              as: 'guardians',
              attributes: ['id', 'name', 'last_name', 'phone'],
              through: { attributes: [] },
            },
          ],
          transaction,
        });

        await transaction.commit();
        return res.status(201).json(fullStudent);
      } catch (e) {
        if (transaction && !transaction.finished) await transaction.rollback();

        // Colisão de matrícula sob concorrência: regenera e tenta de novo.
        if (
          this.isRegistrationCollision(e) &&
          attempt < MAX_REGISTRATION_RETRIES
        ) {
          continue;
        }

        return this.handleErrors(e, res);
      }
    }
  };

  index = async (req, res) => {
    try {
      let whereClause = {};

      const guardianInclude = {
        model: Guardian,
        as: 'guardians',
        attributes: ['id', 'name', 'last_name', 'phone'],
        through: { attributes: [] },
      };

      // Regra de visualização do que Student e Guardian podem ver.
      if (req.userRole === 'Student') {
        whereClause.user_id = req.userId;
      } else if (req.userRole === 'Guardian') {
        guardianInclude.where = { user_id: req.userId };
        guardianInclude.required = true;
      }

      const { searchTerm } = req.query;
      if (searchTerm) {
        const searchPattern = `%${escapeLike(searchTerm)}%`;
        whereClause[Sequelize.Op.or] = [
          { name: { [Sequelize.Op.like]: searchPattern } },
          { last_name: { [Sequelize.Op.like]: searchPattern } },
          { email: { [Sequelize.Op.like]: searchPattern } },
          { registration_number: { [Sequelize.Op.like]: searchPattern } },
        ];
      }

      // PAGINAÇÃO
      const { page = 1, limit = 15 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const students = await Student.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset,
        attributes: { exclude: ['created_at', 'updated_at'] },
        distinct: true,
        order: [['name', 'ASC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'access_level_id', 'status'],
          },
          {
            model: Address,
            as: 'addresses',
            attributes: [
              'id',
              'zip_code',
              'street',
              'number',
              'complement',
              'neighborhood',
              'city',
              'state',
            ],
          },
          guardianInclude,
        ],
      });

      const totalPages = Math.ceil(students.count / Number(limit));

      return res.json({
        totalItems: students.count,
        totalPages,
        currentPage: Number(page),
        data: students.rows,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  show = async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      const student = await Student.findByPk(id, {
        attributes: { exclude: ['created_at', 'updated_at'] },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'status'],
          },
          {
            model: Address,
            as: 'addresses',
            attributes: [
              'id',
              'zip_code',
              'street',
              'number',
              'complement',
              'neighborhood',
              'city',
              'state',
            ],
          },
          {
            model: Guardian,
            as: 'guardians',
            attributes: [
              'id',
              'name',
              'last_name',
              'phone',
              'email',
              'user_id',
            ],
            through: { attributes: [] },
          },
        ],
        order: [[{ model: Address, as: 'addresses' }, 'id', 'ASC']],
      });

      if (!student) {
        return res.status(404).json({ errors: ['Student not found.'] });
      }

      // Regra para o aluno ver somente o perfil dele.
      if (req.userRole === 'Student') {
        if (Number(student.user_id) !== Number(req.userId)) {
          return res.status(403).json({
            errors: ['Forbidden. You can only view your own profile.'],
          });
        }
      }
      // Regra para o responsável ver somente os alunos vinculados a ele.
      else if (req.userRole === 'Guardian') {
        const isGuardianLinked = student.guardians.some(
          (guardian) => Number(guardian.user_id) === Number(req.userId),
        );

        if (!isGuardianLinked) {
          return res.status(403).json({
            errors: [
              'Forbidden. This student is not registered as your dependent.',
            ],
          });
        }
      }

      return res.json(student);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  update = async (req, res) => {
    const transaction = await database.transaction();

    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        await transaction.rollback();
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      const student = await Student.findByPk(id, { transaction });

      if (!student) {
        await transaction.rollback();
        return res.status(404).json({ errors: ['Student not found.'] });
      }

      const { addresses, guardian_ids, ...rawStudentData } = req.body;
      const safeUpdateData = {
        name: rawStudentData.name,
        last_name: rawStudentData.last_name,
        email: rawStudentData.email,
        cpf: rawStudentData.cpf,
        birth_date: rawStudentData.birth_date,
        blood_type: rawStudentData.blood_type,
        medical_notes: rawStudentData.medical_notes,
      };

      await student.update(safeUpdateData, { transaction });

      // Lógica para preservar o ID dos endereços existentes
      // e excluir os que não retornarem no array.
      if (addresses && Array.isArray(addresses)) {
        const incomingIds = addresses
          .filter((addr) => addr.id)
          .map((addr) => Number(addr.id));

        await Address.destroy({
          where: {
            student_id: id,
            ...(incomingIds.length > 0
              ? { id: { [Sequelize.Op.notIn]: incomingIds } }
              : {}),
          },
          transaction,
        });

        for (const addr of addresses) {
          const addressData = {
            zip_code: addr.zip_code,
            street: addr.street,
            number: addr.number,
            complement: addr.complement,
            neighborhood: addr.neighborhood,
            city: addr.city,
            state: addr.state,
            student_id: id,
          };

          if (addr.id) {
            // Ignora id de endereço de outro aluno.
            await Address.update(addressData, {
              where: { id: Number(addr.id), student_id: id },
              transaction,
            });
          } else {
            await Address.create(addressData, { transaction });
          }
        }
      }

      if (guardian_ids && Array.isArray(guardian_ids)) {
        await student.setGuardians(guardian_ids, { transaction });
      }

      const updatedStudent = await Student.findByPk(id, {
        attributes: [
          'id',
          'name',
          'last_name',
          'email',
          'cpf',
          'registration_number',
          'birth_date',
          'blood_type',
          'medical_notes',
          'status',
          'avatar_url',
        ],
        include: [
          {
            model: Address,
            as: 'addresses',
            attributes: [
              'id',
              'zip_code',
              'street',
              'number',
              'complement',
              'neighborhood',
              'city',
              'state',
            ],
          },
          {
            model: Guardian,
            as: 'guardians',
            attributes: ['id', 'name', 'last_name', 'phone'],
            through: { attributes: [] },
          },
        ],
        transaction,
      });

      await transaction.commit();
      return res.json(updatedStudent);
    } catch (e) {
      if (transaction && !transaction.finished) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  delete = async (req, res) => {
    const transaction = await database.transaction();
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        await transaction.rollback();
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      const student = await Student.findByPk(id, {
        include: [{ model: User, as: 'user' }],
        transaction,
      });

      if (!student) {
        await transaction.rollback();
        return res.status(404).json({ errors: ['Student not found.'] });
      }

      // SOFT DELETE
      await student.update({ status: 'inactive' }, { transaction });

      if (student.user) {
        await student.user.update({ status: 'inactive' }, { transaction });
      }

      await transaction.commit();
      return res.json({ message: 'Student deactivated successfully.' });
    } catch (e) {
      if (transaction && !transaction.finished) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  handleErrors(e, res) {
    if (e instanceof Sequelize.ValidationError) {
      return res
        .status(400)
        .json({ errors: e.errors.map((err) => err.message) });
    }
    if (e instanceof Sequelize.ForeignKeyConstraintError) {
      return res
        .status(400)
        .json({ errors: ['Referenced ID does not exist.'] });
    }
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
}

export default new StudentController();
