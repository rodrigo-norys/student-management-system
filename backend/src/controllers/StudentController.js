import Student from '../models/Student.js';
import User from '../models/User.js';
import Address from '../models/Address.js';

import Sequelize from 'sequelize';
import database from '../database/index.js';

// ALTERAR ESSE BLOCO DO CÓDIGO PARA O SOFT DELETE POSTERIORMENTE
// ASSIM COMO CRIAR UMA NOVA PROPRIEDADE NA ENTIDADE DE ESTUDANTES

class StudentController {
  // create
  async create(req, res) {
    const transaction = await database.transaction();

    try {
      const { addresses, ...studentData } = req.body;

      const newStudent = await Student.create(
        {
          ...studentData,
          user_id: null
        },
        { transaction },
      );

      if (addresses && addresses.length > 0) {
        const addressesToSave = addresses.map((address) => ({
          ...address,
          student_id: newStudent.id,
        }));

        await Address.bulkCreate(addressesToSave, { transaction });
      }

      await transaction.commit();

      const fullStudent = await Student.findByPk(newStudent.id, {
        attributes: ['id', 'name', 'last_name', 'email', 'cpf', 'registration_number', 'birth_date', 'blood_type', 'medical_notes'],
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
          order: [['id', 'ASC']],
        }],
      });

      return res.json(fullStudent);
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  // index
  async index(req, res) {
    try {
      const whereClause = req.userAccessLevel === 5
        ? { user_id: req.userId }
        : {};

      const students = await Student.findAll({
        where: whereClause,
        attributes: ['id', 'avatar_url', 'name', 'last_name', 'email', 'registration_number', 'cpf', 'birth_date', 'blood_type', 'medical_notes'],
        order: [['name', 'ASC']],
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
        ]
      });

      return res.json(students);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  // show
  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) return res.status(400).json({ errors: ['Missing ID.'] });

      const student = await Student.findByPk(id, {
        attributes: ['id', 'avatar_url', 'name', 'last_name', 'email', 'registration_number', 'cpf', 'birth_date', 'blood_type', 'medical_notes'],
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
          order: [['id', 'ASC']],
        }]
      });

      if (!student) return res.status(404).json({ errors: ['Student not found.'] });

      if (req.userAccessLevel === 5 && Number(student.user_id) !== Number(req.userId)) {
        return res.status(403).json({ error: 'You only have permission to view your own records.' });
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

      if (!id || isNaN(id)) return res.status(400).json({ errors: ['Missing or ivalid ID.'] });

      const student = await Student.findByPk(id, { transaction });
      if (!student) {
        await transaction.rollback();
        return res.status(404).json({ errors: ['Student not found.'] });
      }

      const { addresses, ...studentData } = req.body;

      await student.update(studentData, { transaction });

      if (addresses) {
        await Address.destroy(
          {
            where: { student_id: id },
            transaction
          }
        );

        if (addresses.length > 0) {
          const addressesToSave = addresses.map((address) => ({
            ...address,
            student_id: id,
          }));
          await Address.bulkCreate(addressesToSave, { transaction });
        }
      }

      await transaction.commit();

      const updatedStudent = await Student.findByPk(id, {
        attributes: ['id', 'name', 'last_name', 'email', 'avatar_url', 'registration_number', 'cpf', 'birth_date', 'blood_type', 'medical_notes'],
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ['id', 'zip_code', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
        }],
        order: [[{ model: Address, as: 'addresses' }, 'id', 'ASC']]
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
      if (!id || isNaN(id)) return res.status(400).json({ errors: ['Missing ID.'] });

      const student = await Student.findByPk(id, { transaction });

      if (!student) {
        await transaction.rollback();
        return res.status(404).json({ errors: ['Student not found.'] });
      }

      await student.destroy({ transaction });
      await transaction.commit();

      return res.json({
        deleted: true,
        message: 'Student successfully deleted.'
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

    return res.status(500).json({
      errors: ['Internal server error.'],
    });
  }
}

export default new StudentController();
