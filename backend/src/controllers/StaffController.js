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
import { parsePagination } from '../utils/pagination.js';

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

function addressRow(address, staffId) {
  return {
    zip_code: address.zip_code,
    street: address.street,
    number: address.number,
    complement: address.complement,
    neighborhood: address.neighborhood,
    city: address.city,
    state: address.state,
    staff_id: staffId,
  };
}

class StaffController {
  create = async (req, res) => {
    const transaction = await database.transaction();
    try {
      // O vínculo com a conta é criado pelo UserController.
      const { addresses } = req.body;
      const staffData = {
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
        avatar_url: null,
        user_id: null,
      };

      const newStaff = await Staff.create(staffData, { transaction });

      if (addresses && Array.isArray(addresses) && addresses.length > 0) {
        await Address.bulkCreate(
          addresses.map((address) => addressRow(address, newStaff.id)),
          { transaction },
        );
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
  };

  index = async (req, res) => {
    try {
      const { page, limit, offset } = parsePagination(req.query);

      const staffMembers = await Staff.findAndCountAll({
        limit,
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

      const totalPages = Math.ceil(staffMembers.count / limit);

      return res.json({
        totalItems: staffMembers.count,
        totalPages,
        currentPage: page,
        data: staffMembers.rows,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  show = async (req, res) => {
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
  };

  update = async (req, res) => {
    const transaction = await database.transaction();
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        await transaction.rollback();
        return res.status(400).json({
          errors: ['Missing or invalid ID.'],
        });
      }

      // O include do user só é necessário quando há desativação, que roda a
      // mesma guarda do delete.
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

      // user_id e avatar_url ficam de fora: o vínculo é operação de conta e o
      // avatar tem rota própria, guardada por avatarAuth.
      const { addresses } = req.body;
      const staffData = {
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
          await Address.bulkCreate(
            addresses.map((address) => addressRow(address, id)),
            { transaction },
          );
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
  };

  delete = async (req, res) => {
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

      // A conta vinculada não é tocada: o cascade parte do UserController.
      await staffMember.update({ status: 'inactive' }, { transaction });

      await transaction.commit();
      return res.json({
        message: 'Staff member deactivated successfully.',
      });
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  handleErrors(e, res) {
    // UniqueConstraintError estende ValidationError e precisa vir antes.
    if (e instanceof Sequelize.UniqueConstraintError) {
      return res.status(400).json({
        errors: [
          'One or more unique fields are already in use (e.g., CPF or Email).',
        ],
      });
    }
    if (e instanceof Sequelize.ValidationError) {
      const messages = e.errors.map((err) => err.message).filter(Boolean);
      return res.status(400).json({
        errors: messages.length > 0 ? messages : ['Invalid data provided.'],
      });
    }
    console.error('StaffController Error:', e);
    return res.status(500).json({
      errors: ['Internal server error.'],
    });
  }
}

export default new StaffController();
