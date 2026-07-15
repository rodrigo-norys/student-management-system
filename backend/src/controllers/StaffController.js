import Sequelize from 'sequelize';
import database from '../database/index.js';

import Staff from '../models/Staff.js';
import User from '../models/User.js';
import Address from '../models/Address.js';
import AccessLevel from '../models/AccessLevel.js';

import {
  isProtectedTarget,
  hasAuthorityOver,
  PROTECTED_TARGET_ERROR,
} from '../utils/hierarchy.js';

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

class StaffController {
  async create(req, res) {
    const transaction = await database.transaction();
    try {
      const { addresses, ...staffData } = req.body;

      const newStaff = await Staff.create(
        {
          ...staffData,
          user_id: null,
        },
        { transaction },
      );

      if (addresses && Array.isArray(addresses) && addresses.length > 0) {
        const addressesToSave = addresses.map((address) => ({
          ...address,
          staff_id: newStaff.id,
        }));
        await Address.bulkCreate(addressesToSave, { transaction });
      }

      const fullStaff = await Staff.findByPk(newStaff.id, {
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
        ],
        transaction,
      });

      await transaction.commit();
      return res.status(201).json(fullStaff);
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  async index(req, res) {
    try {
      const { page = 1, limit = 15 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const staffMembers = await Staff.findAndCountAll({
        limit: Number(limit),
        offset,
        attributes: {
          exclude: ['created_at', 'updated_at'],
        },
        distinct: true,
        order: [['full_name', 'ASC']],
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
        ],
      });

      const totalPages = Math.ceil(staffMembers.count / Number(limit));

      return res.json({
        totalItems: staffMembers.count,
        totalPages,
        currentPage: Number(page),
        data: staffMembers.rows,
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

      const staff = await Staff.findByPk(id, {
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
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'access_level_id', 'status'],
          },
        ],
        order: [[{ model: Address, as: 'addresses' }, 'id', 'ASC']],
      });

      if (!staff) {
        return res.status(404).json({
          errors: ['Staff member not found.'],
        });
      }

      return res.json(staff);
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

      // Desativar por aqui (status ≠ active) é o mesmo ato hostil do delete e
      // roda a mesma guarda; só então o vínculo com a conta importa e precisa
      // ser carregado.
      const isDeactivating =
        req.body.status !== undefined && req.body.status !== 'active';

      const staffToUpdate = await Staff.findByPk(id, {
        include: isDeactivating
          ? [
              {
                model: User,
                as: 'user',
                include: [{ model: AccessLevel, as: 'access_level' }],
              },
            ]
          : undefined,
        transaction,
      });
      if (!staffToUpdate) {
        await transaction.rollback();
        return res.status(404).json({
          errors: ['Staff member not found.'],
        });
      }

      if (isDeactivating) {
        const { user_id: targetUserId, user: targetUser } = staffToUpdate;

        if (isProtectedTarget(targetUserId, targetUser)) {
          await transaction.rollback();
          return res.status(403).json({ errors: [PROTECTED_TARGET_ERROR] });
        }

        if (
          Number(targetUserId) === Number(req.userId) ||
          !hasAuthorityOver(req.userWeight, targetUserId, targetUser)
        ) {
          await transaction.rollback();
          return res.status(403).json({
            errors: ['Forbidden or restricted action.'],
          });
        }
      }

      // Whitelist: user_id fica de fora — religar uma ficha a outra conta é
      // operação de conta, não de cadastro, e mudá-lo aqui driblaria a guarda,
      // que consulta justamente esse vínculo.
      const { addresses } = req.body;
      const staffData = {
        avatar_url: req.body.avatar_url,
        full_name: req.body.full_name,
        email: req.body.email,
        cpf: req.body.cpf,
        birth_date: req.body.birth_date,
        phone: req.body.phone,
        personal_email: req.body.personal_email,
        job_title: req.body.job_title,
        hiring_date: req.body.hiring_date,
        termination_date: req.body.termination_date,
        medical_notes: req.body.medical_notes,
        status: req.body.status,
      };
      await staffToUpdate.update(staffData, { transaction });

      if (addresses) {
        await Address.destroy({
          where: { staff_id: id },
          transaction,
        });
        if (Array.isArray(addresses) && addresses.length > 0) {
          const addressesToSave = addresses.map((address) => ({
            ...address,
            staff_id: id,
          }));
          await Address.bulkCreate(addressesToSave, { transaction });
        }
      }

      const updatedStaff = await Staff.findByPk(id, {
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
        ],
        transaction,
      });

      await transaction.commit();
      return res.json(updatedStaff);
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

      const staffMember = await Staff.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            include: [{ model: AccessLevel, as: 'access_level' }],
          },
        ],
        transaction,
      });

      if (!staffMember) {
        await transaction.rollback();
        return res.status(404).json({
          errors: ['Staff member not found.'],
        });
      }

      const { user_id: targetUserId, user: targetUser } = staffMember;

      if (isProtectedTarget(targetUserId, targetUser)) {
        await transaction.rollback();
        return res.status(403).json({ errors: [PROTECTED_TARGET_ERROR] });
      }

      if (
        Number(targetUserId) === Number(req.userId) ||
        !hasAuthorityOver(req.userWeight, targetUserId, targetUser)
      ) {
        await transaction.rollback();
        return res.status(403).json({
          errors: ['Forbidden or restricted action.'],
        });
      }

      // Soft delete só da ficha: a conta vinculada não é tocada. Todo cascade
      // nasce no UserController, sob ?cascade=true.
      await staffMember.update({ status: 'inactive' }, { transaction });

      await transaction.commit();
      return res.json({
        message: 'Staff member deactivated successfully.',
      });
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  handleErrors(e, res) {
    if (e instanceof Sequelize.ValidationError) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
    if (e instanceof Sequelize.UniqueConstraintError) {
      return res.status(400).json({
        errors: [
          'One or more unique fields are already in use (e.g., CPF or Email).',
        ],
      });
    }
    console.error('StaffController Error:', e);
    return res.status(500).json({
      errors: ['An internal server error occurred.'],
    });
  }
}

export default new StaffController();
