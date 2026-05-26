import Student from '../models/Student.js';
import Guardian from '../models/Guardian.js';
import User from '../models/User.js';
import Address from '../models/Address.js';

import Sequelize from 'sequelize';
import database from '../database/index.js';

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

class StudentController {
  create = async (req, res) => {
    const transaction = await database.transaction();

    try {
      const { addresses, guardian_ids, ...rawStudentData } = req.body;

      const sanitizedStudentData = {
        name: rawStudentData.name,
        last_name: rawStudentData.last_name,
        email: rawStudentData.email,
        cpf: rawStudentData.cpf,
        birth_date: rawStudentData.birth_date,
        blood_type: rawStudentData.blood_type,
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
          'birth_date',
          'blood_type',
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
      return this.handleErrors(e, res);
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

      // Regra de visualização do que Student e Guardian podem ver
      if (req.userRole === 'Student') {
        whereClause.user_id = req.userId;
      } else if (req.userRole === 'Guardian') {
        guardianInclude.where = { user_id: req.userId };
        guardianInclude.required = true;
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
      };

      await student.update(safeUpdateData, { transaction });

      // Atualização dos endereços.
      if (addresses) {
        await Address.destroy({ where: { student_id: id }, transaction });

        if (Array.isArray(addresses) && addresses.length > 0) {
          const addressesToSave = addresses.map((addr) => ({
            zip_code: addr.zip_code,
            street: addr.street,
            number: addr.number,
            complement: addr.complement,
            neighborhood: addr.neighborhood,
            city: addr.city,
            state: addr.state,
            student_id: id,
          }));
          await Address.bulkCreate(addressesToSave, { transaction });
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
          'birth_date',
          'blood_type',
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

      if (!req.userPermissions || !req.userPermissions.manage_record) {
        await transaction.rollback();
        return res
          .status(403)
          .json({
            errors: [
              'Forbidden. You lack the necessary manage_record permission.',
            ],
          });
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
