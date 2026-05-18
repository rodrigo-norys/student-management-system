import Sequelize from 'sequelize';
import database from '../database/index.js';

import User from '../models/User.js';
import AccessLevel from '../models/AccessLevel.js';
import Student from '../models/Student.js';
import Guardian from '../models/Guardian.js';
import Staff from '../models/Staff.js';

const { Op: Operators } = Sequelize;

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

class UserController {
  // Método de busca para as entidades que não possuem um usuário.
  async searchTargets(req, res) {
    try {
      const { searchTerm, page = 1, limit = 15 } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const offset = (pageNum - 1) * limitNum;

      const studentWhere = { user_id: null };
      const guardianWhere = { user_id: null };
      const staffWhere = { user_id: null };

      if (searchTerm) {
        const searchPattern = `%${searchTerm}%`;

        studentWhere[Operators.or] = [
          { name: { [Operators.like]: searchPattern } },
          { last_name: { [Operators.like]: searchPattern } },
          { cpf: { [Operators.like]: searchPattern } },
          { email: { [Operators.like]: searchPattern } },
          { registration_number: { [Operators.like]: searchPattern } },
        ];

        guardianWhere[Operators.or] = [
          { name: { [Operators.like]: searchPattern } },
          { last_name: { [Operators.like]: searchPattern } },
          { cpf: { [Operators.like]: searchPattern } },
          { email: { [Operators.like]: searchPattern } },
        ];

        staffWhere[Operators.or] = [
          { full_name: { [Operators.like]: searchPattern } },
          { cpf: { [Operators.like]: searchPattern } },
          { email: { [Operators.like]: searchPattern } },
        ];
      }

      const [students, guardians, staffMembers] = await Promise.all([
        Student.findAll({
          where: studentWhere,
          attributes: ['id', 'name', 'last_name', 'email', 'cpf'],
        }),
        Guardian.findAll({
          where: guardianWhere,
          attributes: ['id', 'name', 'last_name', 'email', 'cpf'],
        }),
        Staff.findAll({
          where: staffWhere,
          attributes: ['id', 'full_name', 'email', 'cpf'],
        }),
      ]);

      const results = [
        ...students.map((student) => ({
          ...student.get(),
          type: 'student',
          displayName: `${student.name} ${student.last_name}`,
        })),
        ...guardians.map((guardian) => ({
          ...guardian.get(),
          type: 'guardian',
          displayName: `${guardian.name} ${guardian.last_name}`,
        })),
        ...staffMembers.map((staffMember) => ({
          ...staffMember.get(),
          type: 'staff',
          displayName: staffMember.full_name,
        })),
      ];

      const totalCount = results.length;
      const totalPages = Math.ceil(totalCount / limitNum);
      const paginatedResults = results.slice(offset, offset + limitNum);

      return res.json({
        rows: paginatedResults,
        totalPages,
        totalCount,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  async create(req, res) {
    const transaction = await database.transaction();
    try {
      const {
        access_level_id,
        email,
        avatar_url,
        password,
        is_active,
        is_temporary,
        student_id,
        guardian_id,
        staff_id,
      } = req.body;

      const targetLevel = await AccessLevel.findByPk(access_level_id, {
        transaction,
      });
      if (!targetLevel) {
        await transaction.rollback();
        return res.status(400).json({ errors: ['Access level not found.'] });
      }

      // Um usuário só pode criar outro usuário com peso menor que ele.
      if (req.userWeight < targetLevel.hierarchy_weight) {
        await transaction.rollback();
        return res.status(403).json({
          errors: [
            'Forbidden. You do not have the authority to create a user with this access level.',
          ],
        });
      }

      let TargetModel;
      let personId;

      if (staff_id) {
        TargetModel = Staff;
        personId = staff_id;
      } else if (student_id) {
        TargetModel = Student;
        personId = student_id;
      } else if (guardian_id) {
        TargetModel = Guardian;
        personId = guardian_id;
      }

      if (!TargetModel) {
        await transaction.rollback();
        return res.status(400).json({
          errors: [
            'A user must be linked to a person (Staff, Student, or Guardian).',
          ],
        });
      }

      const person = await TargetModel.findByPk(personId, { transaction });
      if (!person) {
        await transaction.rollback();
        return res.status(404).json({
          errors: ['The specified person does not exist in the system.'],
        });
      }

      // Prevenção de duplicação de conta para um mesmo usuário.
      if (person.user_id) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ errors: ['This person already has a linked user account.'] });
      }

      const emailExists = await User.findOne({ where: { email }, transaction });
      if (emailExists) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ errors: ['This email is already registered.'] });
      }

      const newUser = await User.create(
        {
          email,
          password,
          access_level_id,
          avatar_url,
          is_active: is_active ?? 1,
          is_temporary: is_temporary ?? 0,
        },
        { transaction },
      );

      await person.update({ user_id: newUser.id }, { transaction });

      const userCreated = await User.findByPk(newUser.id, {
        attributes: ['id', 'email', 'avatar_url', 'is_active', 'is_temporary'],
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
            attributes: ['name', 'hierarchy_weight'],
          },
        ],
        transaction,
      });

      await transaction.commit();
      return res.status(201).json(userCreated);
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  async index(req, res) {
    try {
      const { searchTerm, page = 1, limit = 15 } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const offset = (pageNum - 1) * limitNum;

      const where = {};

      if (searchTerm) {
        where[Operators.or] = [
          { email: { [Operators.like]: `%${searchTerm}%` } },
        ];
      }

      const { count, rows } = await User.findAndCountAll({
        where,
        attributes: [
          'id',
          'email',
          'avatar_url',
          'is_active',
          'is_temporary',
          'access_level_id',
        ],
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
            attributes: [
              'name',
              'hierarchy_weight',
              'manage_account',
              'manage_record',
              'manage_academic',
              'manage_finance',
            ],
          },
        ],
        order: [['id', 'DESC']],
        limit: limitNum,
        offset: offset,
      });

      const totalPages = Math.ceil(count / limitNum);

      return res.json({
        rows,
        totalPages,
        totalCount: count,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ errors: ['Missing user ID.'] });
      }

      const user = await User.findByPk(id, {
        attributes: [
          'id',
          'email',
          'avatar_url',
          'is_active',
          'is_temporary',
          'access_level_id',
        ],
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
            attributes: [
              'name',
              'hierarchy_weight',
              'manage_account',
              'manage_record',
              'manage_academic',
              'manage_finance',
            ],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ errors: ['User not found.'] });
      }

      return res.json(user);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  async update(req, res) {
    const transaction = await database.transaction();
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        await transaction.rollback();
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      const userToUpdate = await User.findByPk(id, {
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
          },
        ],
        transaction,
      });

      const isEditingSelf = Number(id) === Number(req.userId);
      const myWeight = req.userWeight;
      const targetWeight = userToUpdate.access_level.hierarchy_weight;

      if (!isEditingSelf && myWeight <= targetWeight) {
        await transaction.rollback();
        return res.status(403).json({
          errors: [
            'Forbidden. You do not have enough authority to edit this user.',
          ],
        });
      }
      const {
        email,
        avatar_url,
        access_level_id,
        is_active,
        is_temporary,
        password,
      } = req.body;

      // REGRA DE PROMOÇÃO: Não pode atribuir um nível de acesso com peso maior que o seu próprio.
      if (
        access_level_id &&
        Number(access_level_id) !== userToUpdate.access_level_id
      ) {
        const newLevel = await AccessLevel.findByPk(access_level_id, {
          transaction,
        });
        if (!newLevel || myWeight < newLevel.hierarchy_weight) {
          await transaction.rollback();
          return res.status(403).json({
            errors: [
              'Forbidden. You cannot assign an access level higher than your own.',
            ],
          });
        }
      }
      const updateData = {
        email,
        avatar_url,
        access_level_id,
        is_active,
        is_temporary,
      };
      if (password) updateData.password = password;
      await userToUpdate.update(updateData, { transaction });
      const updatedUser = await User.findByPk(id, {
        attributes: [
          'id',
          'email',
          'avatar_url',
          'access_level_id',
          'is_active',
          'is_temporary',
        ],
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
            attributes: ['name', 'description'],
          },
        ],
        transaction,
      });
      await transaction.commit();
      return res.json(updatedUser);
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  async delete(req, res) {
    const transaction = await database.transaction();
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        await transaction.rollback();
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      const userToDelete = await User.findByPk(id, {
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
          },
        ],
        transaction,
      });

      const isSelf = Number(id) === Number(req.userId);
      const hasAuthority =
        req.userWeight > userToDelete.access_level.hierarchy_weight;

      if (isSelf || !hasAuthority) {
        await transaction.rollback();
        return res.status(403).json({
          errors: [
            'Forbidden. Insufficient authority to deactivate this user or self-deactivation attempt.',
          ],
        });
      }

      // Soft Delete
      await userToDelete.update({ is_active: 0 }, { transaction });

      await transaction.commit();
      return res.json({
        message:
          'User successfully deactivated while preserving historical data.',
      });
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  async setupPassword(req, res) {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ errors: ['Password is required.'] });
      }

      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(404).json({ errors: ['User not found.'] });
      }

      if (!user.is_temporary) {
        return res.status(400).json({
          errors: ['Password setup is only allowed for temporary accounts.'],
        });
      }

      await user.update({
        password,
        is_temporary: 0,
      });

      return res.json({ success: true });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  handleErrors(error, res) {
    if (error instanceof Sequelize.ValidationError) {
      return res
        .status(400)
        .json({ errors: error.errors.map((err) => err.message) });
    }
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(400).json({ errors: ['Email is already in use.'] });
    }
    console.error('UserController Error:', error);
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
}

export default new UserController();
