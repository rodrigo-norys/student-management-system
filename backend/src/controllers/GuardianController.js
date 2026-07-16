import Sequelize from 'sequelize';
import database from '../database/index.js';

import Guardian from '../models/Guardian.js';
import Student from '../models/Student.js';
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

function addressRow(address, guardianId) {
  return {
    zip_code: address.zip_code,
    street: address.street,
    number: address.number,
    complement: address.complement,
    neighborhood: address.neighborhood,
    city: address.city,
    state: address.state,
    guardian_id: guardianId,
  };
}

class GuardianController {
  create = async (req, res) => {
    const transaction = await database.transaction();
    try {
      // O vínculo com a conta é criado pelo UserController.
      const { addresses, student_ids } = req.body;
      const guardianData = {
        name: req.body.name,
        last_name: req.body.last_name,
        cpf: req.body.cpf,
        phone: req.body.phone,
        email: req.body.email,
        avatar_url: null,
        user_id: null,
      };

      const newGuardian = await Guardian.create(guardianData, { transaction });

      if (addresses && Array.isArray(addresses) && addresses.length > 0) {
        await Address.bulkCreate(
          addresses.map((address) => addressRow(address, newGuardian.id)),
          { transaction },
        );
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
  };

  index = async (req, res) => {
    try {
      const { page = 1, limit = 15 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const guardians = await Guardian.findAndCountAll({
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
  };

  show = async (req, res) => {
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

      return res.json(guardian);
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

      // Desativar por aqui (status ≠ active) é o mesmo ato hostil do delete e
      // roda a mesma guarda; só então o vínculo com a conta importa e precisa
      // ser carregado.
      const isDeactivating =
        req.body.status !== undefined && req.body.status !== 'active';

      const guardian = await Guardian.findByPk(id, {
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
      if (!guardian) {
        await transaction.rollback();
        return res.status(404).json({
          errors: ['Guardian not found.'],
        });
      }

      if (isDeactivating) {
        const { user_id: targetUserId, user: targetUser } = guardian;

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

      // user_id e avatar_url ficam de fora: o vínculo com a conta é operação de
      // conta, e o avatar tem rota própria, guardada por avatarAuth.
      const { addresses, student_ids } = req.body;
      const guardianData = {
        name: req.body.name,
        last_name: req.body.last_name,
        cpf: req.body.cpf,
        phone: req.body.phone,
        email: req.body.email,
        status: req.body.status,
      };
      await guardian.update(guardianData, { transaction });

      if (addresses) {
        await Address.destroy({
          where: { guardian_id: id },
          transaction,
        });
        if (Array.isArray(addresses) && addresses.length > 0) {
          await Address.bulkCreate(
            addresses.map((address) => addressRow(address, id)),
            { transaction },
          );
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

      const guardian = await Guardian.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            include: [{ model: AccessLevel, as: 'access_level' }],
          },
        ],
        transaction,
      });

      if (!guardian) {
        await transaction.rollback();
        return res.status(404).json({
          errors: ['Guardian not found.'],
        });
      }

      const { user_id: targetUserId, user: targetUser } = guardian;

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
      await guardian.update({ status: 'inactive' }, { transaction });

      await transaction.commit();
      return res.json({
        message: 'Guardian deactivated successfully.',
      });
    } catch (e) {
      if (transaction) await transaction.rollback();
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
