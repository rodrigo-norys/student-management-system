import Sequelize from 'sequelize';
import database from '../database/index.js';

import Guardian from '../models/Guardian.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import Address from '../models/Address.js';

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

class GuardianController {
  async create(req, res) {
    const transaction = await database.transaction();
    try {
      if (req.userLevel > 2) {
        await transaction.rollback();
        return res.status(403).json({
          errors: ['Access denied. You cannot create guardian records.'],
        });
      }

      const { addresses, student_ids, ...guardianData } = req.body;

      const newGuardian = await Guardian.create(
        {
          ...guardianData,
          user_id: null,
        },
        { transaction },
      );

      if (addresses && Array.isArray(addresses) && addresses.length > 0) {
        const addressesToSave = addresses.map((address) => ({
          ...address,
          guardian_id: newGuardian.id,
        }));
        await Address.bulkCreate(addressesToSave, { transaction });
      }

      if (student_ids && Array.isArray(student_ids) && student_ids.length > 0) {
        await newGuardian.setStudents(student_ids, { transaction });
      }

      const fullGuardian = await Guardian.findByPk(newGuardian.id, {
        attributes: {
          exclude: ['created_at', 'updated_at'],
        },
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
            model: Student,
            as: 'students',
            attributes: ['id', 'name', 'last_name', 'registration_number'],
            through: { attributes: [] },
          },
        ],
        transaction,
      });

      await transaction.commit();
      return res.status(201).json(fullGuardian);
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  async index(req, res) {
    try {
      const whereClause = req.userLevel === 5 ? { user_id: req.userId } : {};
      const { page = 1, limit = 15 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const guardians = await Guardian.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset,
        attributes: {
          exclude: ['created_at', 'updated_at'],
        },
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
          {
            model: Student,
            as: 'students',
            attributes: ['id', 'name', 'last_name', 'registration_number'],
            through: { attributes: [] },
          },
        ],
      });

      const totalPages = Math.ceil(guardians.count / Number(limit));

      return res.json({
        totalItems: guardians.count,
        totalPages,
        currentPage: Number(page),
        data: guardians.rows,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res.status(400).json({
          errors: ['Missing or invalid ID.'],
        });
      }

      const guardian = await Guardian.findByPk(id, {
        attributes: {
          exclude: ['created_at', 'updated_at'],
        },
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
            model: Student,
            as: 'students',
            attributes: ['id', 'name', 'last_name', 'registration_number'],
            through: { attributes: [] },
          },
        ],
        order: [[{ model: Address, as: 'addresses' }, 'id', 'ASC']],
      });

      if (!guardian) {
        return res.status(404).json({
          errors: ['Guardian not found.'],
        });
      }

      const isRestrictedRole = [5].includes(req.userLevel);
      if (isRestrictedRole && Number(guardian.user_id) !== Number(req.userId)) {
        return res.status(403).json({ errors: ['Forbidden.'] });
      }

      return res.json(guardian);
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
        return res.status(400).json({
          errors: ['Missing or invalid ID.'],
        });
      }

      const guardian = await Guardian.findByPk(id, { transaction });
      if (!guardian) {
        await transaction.rollback();
        return res.status(404).json({
          errors: ['Guardian not found.'],
        });
      }

      if ([4, 5].includes(req.userLevel)) {
        await transaction.rollback();
        return res.status(403).json({ errors: ['Forbidden.'] });
      }

      const { addresses, student_ids, ...guardianData } = req.body;
      await guardian.update(guardianData, { transaction });

      if (addresses) {
        await Address.destroy({
          where: { guardian_id: id },
          transaction,
        });
        if (Array.isArray(addresses) && addresses.length > 0) {
          const addressesToSave = addresses.map((addr) => ({
            ...addr,
            guardian_id: id,
          }));
          await Address.bulkCreate(addressesToSave, { transaction });
        }
      }

      if (student_ids && Array.isArray(student_ids)) {
        await guardian.setStudents(student_ids, { transaction });
      }

      const updatedGuardian = await Guardian.findByPk(id, {
        attributes: {
          exclude: ['created_at', 'updated_at'],
        },
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
            model: Student,
            as: 'students',
            attributes: ['id', 'name', 'last_name', 'registration_number'],
            through: { attributes: [] },
          },
        ],
        transaction,
      });

      await transaction.commit();
      return res.json(updatedGuardian);
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
        return res.status(400).json({
          errors: ['Missing or invalid ID.'],
        });
      }

      const guardian = await Guardian.findByPk(id, {
        include: [{ model: User, as: 'user' }],
        transaction,
      });

      if (!guardian) {
        await transaction.rollback();
        return res.status(404).json({
          errors: ['Guardian not found.'],
        });
      }

      if (
        Number(guardian.user_id) === Number(req.userId) ||
        req.userLevel > 3
      ) {
        await transaction.rollback();
        return res.status(403).json({
          errors: ['Forbidden or restricted action.'],
        });
      }

      await guardian.update({ status: 'inactive' }, { transaction });

      if (guardian.user) {
        await guardian.user.update({ status: 'inactive' }, { transaction });
      }

      await transaction.commit();
      return res.json({
        message: 'Guardian deactivated successfully.',
      });
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  handleErrors(e, res) {
    if (e instanceof Sequelize.ValidationError) {
      return res
        .status(400)
        .json({ errors: e.errors.map((err) => err.message) });
    }
    if (e instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(400).json({
        errors: ['Relation error: Referenced ID not found.'],
      });
    }
    console.log('REAL_ERROR:', e);
    return res.status(500).json({
      errors: ['Internal server error.'],
    });
  }
}

export default new GuardianController();
