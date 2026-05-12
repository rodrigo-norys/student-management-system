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
  async searchTargets(req, res) {
    try {
      const { searchTerm } = req.query;

      if (!searchTerm || searchTerm.length < 2) {
        return res.json([]);
      }

      const searchPattern = `%${searchTerm}%`;

      const [students, guardians, staffMembers] = await Promise.all([
        Student.findAll({
          where: {
            [Operators.or]: [
              { name: { [Operators.like]: searchPattern } },
              { last_name: { [Operators.like]: searchPattern } },
              { cpf: { [Operators.like]: searchPattern } },
              { email: { [Operators.like]: searchPattern } },
            ],
          },
          attributes: ['id', 'name', 'last_name', 'email', 'cpf'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'access_level_id'],
            },
          ],
          limit: 10,
        }),
        Guardian.findAll({
          where: {
            [Operators.or]: [
              { name: { [Operators.like]: searchPattern } },
              { last_name: { [Operators.like]: searchPattern } },
              { cpf: { [Operators.like]: searchPattern } },
              { email: { [Operators.like]: searchPattern } },
            ],
          },
          attributes: ['id', 'name', 'last_name', 'email', 'cpf'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'access_level_id'],
            },
          ],
          limit: 10,
        }),
        Staff.findAll({
          where: {
            [Operators.or]: [
              { full_name: { [Operators.like]: searchPattern } },
              { cpf: { [Operators.like]: searchPattern } },
              { email: { [Operators.like]: searchPattern } },
            ],
          },
          attributes: ['id', 'full_name', 'email', 'cpf'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'access_level_id'],
            },
          ],
          limit: 10,
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

      return res.json(results);
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

      const newUser = await User.create(
        {
          access_level_id,
          email,
          avatar_url,
          password,
          is_active,
          is_temporary,
        },
        { transaction },
      );

      if (student_id) {
        const student = await Student.findByPk(student_id, { transaction });
        if (!student) {
          await transaction.rollback();
          return res.status(404).json({ errors: ['Student not found.'] });
        }
        await student.update({ user_id: newUser.id }, { transaction });
      }

      if (guardian_id) {
        const guardian = await Guardian.findByPk(guardian_id, { transaction });
        if (!guardian) {
          await transaction.rollback();
          return res.status(404).json({ errors: ['Guardian not found.'] });
        }
        await guardian.update({ user_id: newUser.id }, { transaction });
      }

      if (staff_id) {
        const staff = await Staff.findByPk(staff_id, { transaction });
        if (!staff) {
          await transaction.rollback();
          return res.status(404).json({ errors: ['Staff profile not found.'] });
        }
        await staff.update({ user_id: newUser.id }, { transaction });
      }

      const fullUser = await User.findByPk(newUser.id, {
        attributes: [
          'id',
          'email',
          'access_level_id',
          'is_active',
          'is_temporary',
        ],
        transaction,
      });

      await transaction.commit();
      return res.status(201).json(fullUser);
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  async index(req, res) {
    try {
      const allUsers = await User.findAll({
        attributes: ['id', 'email', 'avatar_url', 'is_active', 'is_temporary'],
        order: [['email', 'ASC']],
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
            attributes: [
              'id',
              'name',
              'description',
              'manage_account',
              'manage_record',
              'manage_academic',
              'manage_finance',
            ],
          },
        ],
      });
      return res.json(allUsers);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }
      if (Number(id) !== Number(req.userId) && req.userLevel > 2) {
        return res.status(403).json({
          errors: ['Forbidden.'],
        });
      }
      const userToShow = await User.findByPk(id, {
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
      });
      if (!userToShow) {
        return res.status(404).json({ errors: ['User not found.'] });
      }
      return res.json(userToShow);
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
      const userToUpdate = await User.findByPk(id, { transaction });
      if (!userToUpdate) {
        await transaction.rollback();
        return res.status(404).json({ errors: ['User not found.'] });
      }
      if (req.userLevel > 2 || req.userLevel > userToUpdate.access_level_id) {
        await transaction.rollback();
        return res.status(403).json({ errors: ['Forbidden.'] });
      }
      const {
        email,
        avatar_url,
        access_level_id,
        is_active,
        is_temporary,
        password,
      } = req.body;
      if (req.userLevel > 1 && Number(access_level_id) === 1) {
        await transaction.rollback();
        return res.status(403).json({ errors: ['Restriction: Super Admin.'] });
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
      const userToDelete = await User.findByPk(id, { transaction });
      if (!userToDelete) {
        await transaction.rollback();
        return res.status(404).json({ errors: ['User not found.'] });
      }
      if (
        req.userLevel > 2 ||
        Number(id) === Number(req.userId) ||
        req.userLevel > userToDelete.access_level_id
      ) {
        await transaction.rollback();
        return res.status(403).json({ errors: ['Forbidden.'] });
      }
      await userToDelete.update({ is_active: 0 }, { transaction });
      await transaction.commit();
      return res.json({ message: 'User successfully deactivated.' });
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  async setupPassword(req, res) {
    try {
      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(400).json({
          errors: ['User not found'],
        });
      }
      await user.update({
        password: req.body.password,
        is_temporary: 0,
      });
      return res.json({ success: true });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
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
