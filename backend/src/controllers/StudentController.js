import Student from '../models/Student.js';
import Photo from '../models/Photo.js';

class StudentController {
  // create
  async create(req, res) {
    try {
      const newStudent = await Student.create(req.body);
      return res.json(newStudent);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message)
      });
    }
  }

  // index
  async index(req, res) {
    try {
      const allStudents = await Student.findAll({
        attributes: ['id', 'name', 'last_name', 'email', 'age', 'weight', 'height'],
        order: [['id', 'DESC'], [Photo, 'id', 'DESC']],
        include: {
          model: Photo,
          attributes: ['url', 'filename']
        }
      });
      return res.json({allStudents});
    } catch (e) {
      return res.json({ errors: e.errors.map(err => err.message) });
    }
  }

  // show
  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['You must enter an ID']
        });
      }
      const student = await Student.findByPk(id, {
        attributes: ['id', 'name', 'last_name', 'email', 'age', 'weight', 'height'],
        order: [['id', 'DESC'], [Photo, 'id', 'DESC']],
        include: {
          model: Photo,
          attributes: ['url', 'filename']
        },
      });

      return res.json(student);
    } catch (e) {
      return res.status(400).json({
        errors: ['Student not found']
      });
    }
  }

  // update
  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['You must enter an ID']
        });
      }
      let student = await Student.findByPk(id);

      if (!student) {
        return res.status(400).json({
          errors: ['Student not found']
        });
      }
      const oldStudent = student.toJSON();

      student = await student.update(
        req.body,
        {
          where: {
            id: id
          }
        }
      );

      if (oldStudent.updated_at.toString() === student.updated_at.toString()) {
        return res.status(400).json({
          errors: ['No lines were affected']
        });
      }

      return res.json(student);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message)
      });
    }
  }

  // delete
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['You must enter an ID']
        });
      }
      const student = await Student.destroy({
        where: {
          id: id
        }
      });

      if (!student) {
        return res.status(400).json({
          errors: ['Student not found']
        });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        errors: ['Student not found']
      });
    }
  }
}

export default new StudentController();
