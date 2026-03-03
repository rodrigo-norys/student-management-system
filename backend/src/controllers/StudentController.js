import Student from '../models/Student.js';
import Address from '../models/Address.js';

import Sequelize from 'sequelize';
import database from '../database/index.js';

class StudentController {
  // create
  async create(req, res) {
    const transaction = await database.transaction();

    try {
      const {
        zip_code, street, number, complement, neighborhood, city, state,
        ...studentData
      } = req.body;

      const newStudent = await Student.create(
        {
          ...studentData,
          user_id: req.userId
        },
        { transaction },
      );

      await Address.create(
        {
          zip_code, street, number, complement, neighborhood, city, state,
          student_id: newStudent.id
        },
        { transaction },
      );

      await transaction.commit();

      const fullStudent = await Student.findByPk(newStudent.id, {
        attributes: ['id', 'name', 'last_name', 'email', 'cpf', 'registration_number', 'birth_date', 'blood_type', 'medical_notes'],
        include: [
          {
            model: Address,
            as: 'addresses',
            attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
          },
        ],
      });

      return res.json(fullStudent);
    } catch (e) {
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
      return res.status(500).json({
        errors: ['Internal server error.'],
      });
    }
  }

  // index
  async index(req, res) {
    try {
      const students = await Student.findAll({
        where: {
          user_id: req.userId
        },
        attributes: ['id', 'name', 'last_name', 'email', 'avatar_url', 'registration_number', 'cpf', 'birth_date', 'blood_type', 'medical_notes'],
        order: [['name', 'ASC']],
        include: [
          {
            model: Address,
            as: 'addresses',
            attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
          },
        ],
      });
      return res.json(students);
    } catch (e) {
      return res.status(500).json({
        errors: ['Internal server error.']
      });
    }
  }

  // show
  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id))
        return res.status(400).json({
          errors: ['Missing ID.']
        });

      const student = await Student.findOne({
        where: {
          id,
          user_id: req.userId
        },
        attributes: ['id', 'name', 'last_name', 'email', 'avatar_url', 'registration_number', 'blood_type', 'medical_notes', 'cpf', 'birth_date', 'blood_type', 'medical_notes'],
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
        }],
      });

      if (!student)
        return res.status(404).json({
          errors: ['Student not found.']
        });
      return res.json(student);
    } catch (e) {
      return res.status(500).json({
        errors: ['Internal server error. Please try again later.'],
      });
    }
  }

  // update
  async update(req, res) {
    const transaction = await database.transaction();
    try {
      const { id } = req.params;
      const student = await Student.findOne({
        where: {
          id,
          user_id: req.userId
        },
        transaction
      });

      if (!student) {
        await transaction.rollback();
        return res.status(404).json({
          errors: ['Student not found.']
        });
      }

      const {
        zip_code, street, number, complement, neighborhood, city, state,
        ...studentData
      } = req.body;

      await student.update(studentData, { transaction });

      if (zip_code || street || number || neighborhood || city || state) {
        const address = await Address.findOne({
          where: {
            student_id: student.id
          },
          transaction
        });

        if (address) {
          await address.update(
            { zip_code, street, number, complement, neighborhood, city, state },
            { transaction },
          );
        } else {
          await Address.create(
            {
              zip_code, street, number, complement, neighborhood, city, state,
              student_id: student.id
            },
            { transaction }
          );
        }
      }

      await transaction.commit();
      const updatedStudent = await Student.findByPk(id,
        {
          include:
            [{
              model: Address,
              as: 'addresses'
            }]
        });
      return res.json(updatedStudent);
    } catch (e) {
      if (transaction) await transaction.rollback();

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

      return res.status(500).json({
        errors: ['Internal server error.'],
      });
    }
  }

  // delete
  async delete(req, res) {
    const transaction = await database.transaction();

    try {
      const { id } = req.params;
      const student = await Student.findOne({
        where:
        {
          id,
          user_id: req.userId
        },
        transaction
      });

      if (!student) {
        await transaction.rollback();
        return res.status(404).json({
          errors: ['Student not found.']
        });
      }

      await student.destroy({ transaction });

      await transaction.commit();
      return res.json({
        deleted: true,
        message: 'Student successfully deleted.'
      });
    } catch (e) {
      if (transaction) await transaction.rollback();

      return res.status(500).json({
        errors: ['Internal server error while trying to delete student.'],
      });
    }
  }
}

export default new StudentController();
