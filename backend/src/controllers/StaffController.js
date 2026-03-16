import Staff from '../models/Staff.js';
import User from '../models/User.js';
import Address from '../models/Address.js';

import Sequelize from 'sequelize';
import database from '../database/index.js';

class StaffController {
  // create
  async create(req, res) {
    const transaction = await database.transaction();

    try {
      if (req.userAccessLevel === 3) {
        await transaction.rollback();
        return res.status(403).json({ errors: ['Finance administrators cannot create staff records.'] });
      }

      const { addresses, ...staffData } = req.body;

      const newStaff = await Staff.create(staffData, { transaction });

      if (addresses && addresses.length > 0) {
        const addressesToSave = addresses.map((address) => ({
          ...address,
          staff_id: newStaff.id,
        }));

        await Address.bulkCreate(addressesToSave, { transaction });
      }

      await transaction.commit();

      const fullStaff = await Staff.findByPk(newStaff.id, {
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
          order: [['id', 'ASC']],
        }],
      });

      return res.json(fullStaff);
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  // index
  async index(req, res) {
    try {
      const staffMembers = await Staff.findAll({
        attributes: ['id', 'avatar_url', 'full_name', 'email', 'cpf', 'birth_date', 'phone', 'personal_email', 'job_title', 'hiring_date', 'status'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'access_level_id'],
          },
          {
            model: Address,
            as: 'addresses',
            attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
          }
        ],
        order: [['full_name', 'ASC']],
      });

      return res.json(staffMembers);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  // show
  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) return res.status(400).json({ errors: ['Missing or invalid ID.'] });

      const staff = await Staff.findByPk(id, {
        attributes: ['id', 'avatar_url', 'full_name', 'email', 'cpf', 'birth_date', 'phone', 'personal_email', 'job_title', 'hiring_date', 'status'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'access_level_id'],
          },
          {
            model: Address,
            as: 'addresses',
            attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
            order: [['id', 'ASC']],
          }
        ],
      });

      if (!staff) return res.status(404).json({ errors: ['Staff member not found.'] });

      return res.json(staff);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  // update
  async update(req, res) {
    const transaction = await database.transaction();

    try {
      const { id } = req.params;

      if (!id || isNaN(id)) return res.status(400).json({ errors: ['Missing or ivalid ID.'] });

      const staffToUpdate = await Staff.findByPk(id, { transaction });

      if (!staffToUpdate) {
        await transaction.rollback();
        return res.status(404).json({ errors: ['Staff member not found.'] });
      }
      const { addresses, ...staffData } = req.body;

      await staffToUpdate.update(staffData, { transaction });

      if (addresses) {
        await Address.destroy(
          {
            where: { staff_id: id },
            transaction
          }
        );

        if (addresses.length > 0) {
          const addressesToSave = addresses.map((address) => ({
            ...address,
            staff_id: id
          }));
          await Address.bulkCreate(addressesToSave, { transaction });
        }
      }

      await transaction.commit();

      const updatedStaff = await Staff.findByPk(id, {
        attributes: [
          'id', 'avatar_url', 'full_name', 'email', 'cpf', 'birth_date', 'phone',
          'personal_email', 'job_title', 'hiring_date', 'status'
        ],
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
          order: [['id', 'ASC']],
        }]
      });

      return res.json(updatedStaff);
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  // delete
  async delete(req, res) {
    const transaction = await database.transaction();

    try {
      if (req.userAccessLevel !== 1 || req.userAccessLevel !== 2) {
        await transaction.rollback();
        return res.status(403).json({
          errors: ['You do not have permission to delete records.']
        });
      }

      const { id } = req.params;

      if (!id || isNaN(id)) {
        await transaction.rollback();
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      const staffMemberToDeactivate = await Staff.findByPk(id, {
        include: [{
          model: User,
          as: 'user'
        }],
        transaction,
      });

      if (!staffMemberToDeactivate) {
        await transaction.rollback();
        return res.status(404).json({ errors: ['Staff member not found.'] });
      }

      await staffMemberToDeactivate.update(
        { status: 'INACTIVE' },
        { transaction }
      );

      if (staffMemberToDeactivate.user) {
        const associatedUserAccount = staffMemberToDeactivate.user;
        await associatedUserAccount.update(
          { is_active: false },
          { transaction }
        );
      }

      await transaction.commit();

      return res.json({
        message: 'Staff member and associated user login deactivated successfully.'
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
        errors: ['One or more unique fields are already in use (e.g., CPF or Email).'],
      });
    }

    if (e instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(400).json({
        errors: ['The provided relation or ID does not exist in the database.'],
      });
    }

    console.error('StaffController Error:', e);
    return res.status(500).json({
      errors: ['An internal server error occurred.'],
    });
  }
}

export default new StaffController();
