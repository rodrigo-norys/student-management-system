import Student from '../models/Student.js';
import Photo from '../models/Photo.js';

class StudentController {
  // create
  async create(req, res) {
    try {
      const newStudent = await Student.create({
        ...req.body,
        user_id: req.userId,
      });
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
      return res.json(await Student.findAll({
        where: {
          user_id: req.userId,
        },
        attributes: ['id', 'name', 'last_name', 'email', 'age', 'weight', 'height'],
        order: [['id', 'DESC'], [Photo, 'id', 'DESC']],
        include: {
          model: Photo,
          attributes: ['url', 'filename']
        }
      }));
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
      const student = await Student.findOne({
        where: {
          id: id,
          user_id: req.userId
        },
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

      const student = await Student.findOne({
        where: {
          id: id,
          user_id: req.userId
        },
      });

      if (!student) {
        return res.status(400).json({
          errors: ['Student not found']
        });
      }

      const updatedStudent = await student.update(req.body);
      return res.json(updatedStudent);
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

      const student = await Student.findOne({
        where: {
          id: id,
          user_id: req.userId
        }
      });

      if (!id) {
        return res.status(400).json({
          errors: ['You must enter an ID']
        });
      }

      if (!student) {
        return res.status(400).json({
          errors: ['Student not found']
        });
      }

      await student.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        errors: ['Student not found']
      });
    }
  }
}

export default new StudentController();
