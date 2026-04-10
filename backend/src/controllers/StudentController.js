import Student from '../models/Student.js';
import User from '../models/User.js';
import Address from '../models/Address.js';

import Sequelize from 'sequelize';
import database from '../database/index.js';

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

class StudentController {
  // create
  async create(req, res) {
    const transaction = await database.transaction();

    try {
      if (req.userLevel > 2) {
        await transaction.rollback();
        return res.status(403).json({
          errors: ['Access denied. You cannot create student records.']
        });
      }

      const { addresses, ...studentData } = req.body;

      const newStudent = await Student.create(
        { ...studentData, user_id: null },
        { transaction },
      );

      if (addresses && Array.isArray(addresses) && addresses.length > 0) {
        const addressesToSave = addresses.map((address) => ({
          ...address,
          student_id: newStudent.id,
        }));

        await Address.bulkCreate(addressesToSave, { transaction });
      }

      await transaction.commit();

      const fullStudent = await Student.findByPk(newStudent.id, {
        attributes: {
          exclude: ['created_at', 'updated_at']
        },
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
        }],
      });

      return res.status(201).json(fullStudent);
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  // index
  async index(req, res) {
    try {
      const whereClause = req.userLevel === 5
        ? { user_id: req.userId }
        : {};

      const { page = 1, limit = 15 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const students = await Student.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset,
        attributes: {
          exclude: ['created_at', 'updated_at']
        },
        distinct: true,
        order: [['name', 'ASC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'access_level_id', 'is_active'],
          },
          {
            model: Address,
            as: 'addresses',
            attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
          }
        ]
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
  }

  // show
  async show(req, res) {
    try {
      const { id } = req.params;

      if (!isValidId(id)) return res.status(400).json({
        errors: ['Missing or invalid ID.'],
      });

      const student = await Student.findByPk(id, {
        attributes: {
          exclude: ['created_at', 'updated_at']
        },
        include: [
          {
            model: Address,
            as: 'addresses',
            attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
            order: [['id', 'ASC']],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'is_active'],
          },
        ]
      });

      if (!student) return res.status(404).json({
        errors: ['Student not found.']
      });

      const isRestrictedRole = [5].includes(req.userLevel);
      const isAccessingOtherRecord = Number(student.user_id) !== Number(req.userId);

      if (isRestrictedRole && isAccessingOtherRecord) {
        return res.status(403).json({
          errors: ['Forbidden. You can only view your own records.']
        });
      }

      return res.json(student);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  // update
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

      const student = await Student.findByPk(id, { transaction });

      if (!student) {
        await transaction.rollback();

        return res.status(404).json({
          errors: ['Student not found.']
        });
      }

      const isRestrictedRole = [4, 5].includes(req.userLevel);

      if (isRestrictedRole) {
        await transaction.rollback();
        return res.status(403).json({
          errors: ["Forbidden. You don't have permission to edit this record."]
        });
      }

      const { addresses, ...studentData } = req.body;

      await student.update(studentData, { transaction });

      if (addresses) {
        await Address.destroy({
          where: { student_id: id },
          transaction,
        });

        if (Array.isArray(addresses) && addresses.length > 0) {
          const addressesToSave = addresses.map((address) => ({
            ...address,
            student_id: id,
          }));
          await Address.bulkCreate(addressesToSave, { transaction });
        }
      }

      await transaction.commit();

      const updatedStudent = await Student.findByPk(id, {
        attributes: {
          exclude: ['created_at', 'updated_at']
        },
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
        }],
      });

      return res.json(updatedStudent);
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  // delete
  async delete(req, res) {
    const transaction = await database.transaction();

    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        await transaction.rollback();

        return res.status(400).json({
          errors: ['Missing or invalid ID.']
        });
      }

      const student = await Student.findByPk(id, {
        include: [{
          model: User,
          as: 'user'
        }],
        transaction,
      });

      if (!student) {
        await transaction.rollback();

        return res.status(404).json({
          errors: ['Student not found.']
        });
      }

      if (Number(student.user_id) === Number(req.userId)) {
        await transaction.rollback();

        return res.status(403).json({
          errors: ['You cannot deactivate your own record.']
        });
      }

      if (req.userLevel > 3) {
        await transaction.rollback();

        return res.status(403).json({
          errors: ['You do not have permission to deactivate records.']
        });
      }

      await student.update(
        { is_active: 'inactive' },
        { transaction }
      );

      if (student.user) {
        await student.user.update(
          { is_active: 0 },
          { transaction }
        );
      }

      await transaction.commit();

      return res.json({
        message: 'Student and associated user login deactivated successfully.'
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
    if (e instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(400).json({
        errors: ['The provided relation or ID does not exist in the database.'],
      });
    }
    if (e instanceof Sequelize.DatabaseError) {
      return res.status(500).json({
        errors: ['A database error occurred. Please contact the administrator.'],
      });
    }
    console.log('ERRO REAL AQUI:', e);
    return res.status(500).json({
      errors: ['Internal server error.'],
    });
  }
}

export default new StudentController();
