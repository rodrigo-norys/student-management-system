import User from '../models/User.js';
import AccessLevel from '../models/AccessLevel.js';
import Student from '../models/Student.js';
import Sequelize from 'sequelize';
import database from '../database/index.js';

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

class UserController {
  // create
  async create(req, res) {
    const transaction = await database.transaction();

    try {
      const {
        access_level_id, email, avatar_url, password, is_active, is_temporary, student_id
      } = req.body;

      const newUser = await User.create({
        access_level_id, email, avatar_url, password, is_active, is_temporary,
      }, { transaction });

      if (student_id) {
        const student = await Student.findByPk(student_id, { transaction });

        if (student) {
          await student.update({ user_id: newUser.id }, { transaction });
        } else {
          await transaction.rollback();
          return res.status(404).json({
            errors: ['Student not found to link this access account.']
          });
        }
      }

      await transaction.commit();

      const {
        id,
        email: userEmail,
        access_level_id: accessLevelId
      } = newUser;

      return res.status(201).json({
        id,
        email: userEmail,
        access_level_id: accessLevelId,
      });

    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  }

  // index
  async index(req, res) {
    try {
      const allUsers = await User.findAll({
        attributes: ['id', 'email', 'avatar_url', 'is_active', 'is_temporary'],
        order: [['email', 'ASC']],
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
            attributes: ['id', 'name', 'description', 'manage_account', 'manage_record', 'manage_finance']
          }
        ]
      });
      return res.json(allUsers);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  // show
  async show(req, res) {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({
          errors: ['Missing or invalid ID.'],
        });
      }

      if (Number(id) !== Number(req.userId) && req.userLevel > 2) {
        return res.status(403).json({
          errors: ['You do not have permission to view other users profiles.']
        });
      }

      const userToShow = await User.findByPk(id, {
        attributes: ['id', 'email', 'avatar_url', 'access_level_id', 'is_active', 'is_temporary'],
        include: [{
          model: AccessLevel,
          as: 'access_level',
          attributes: ['name', 'description']
        }]
      });

      if (!userToShow) {
        return res.status(404).json({
          errors: ['User not found.']
        });
      }

      return res.json(userToShow);

    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  // update
  async update(req, res) {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      const userToUpdate = await User.findByPk(id);

      if (!userToUpdate) {
        return res.status(404).json({ errors: ['User not found.'] });
      }

      if (req.userLevel > 2) {
        return res.status(403).json({ errors: ["You don't have permission to edit users."] });
      }

      if (req.userLevel > userToUpdate.access_level_id) {
        return res.status(403).json({ errors: ['You cannot edit someone with a higher rank.'] });
      }

      const {
        email, avatar_url, access_level_id, is_active, is_temporary, password
      } = req.body;

      if (req.userLevel > 1 && Number(access_level_id) === 1) {
        return res.status(403).json({ errors: ['You cannot promote a user to super admin.'] });
      }

      const updateData = { email, avatar_url, access_level_id, is_active, is_temporary };

      if (password) {
        updateData.password = password;
      }

      await userToUpdate.update(updateData);

      const updatedUser = await User.findByPk(id, {
        attributes: ['id', 'email', 'avatar_url', 'access_level_id', 'is_active', 'is_temporary'],
        include: [{
          model: AccessLevel,
          as: 'access_level',
          attributes: ['name', 'description']
        }]
      });

      return res.json(updatedUser);

    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  // delete
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({
          errors: ['Missing or invalid ID.'],
        });
      }

      const userToDelete = await User.findByPk(id);
      if (!userToDelete) {
        return res.status(404).json({
          errors: ['User not found.'],
        });
      }

      if (req.userLevel > 2 || Number(id) === Number(req.userId)) {
        return res.status(403).json({
          errors: ['You do not have permission to delete this user profile.']
        });
      }

      if (req.userLevel > userToDelete.access_level_id) {
        return res.status(403).json({
          errors: ['You cannot delete a user with a higher or equal access level.']
        });
      }

      await userToDelete.update({
        is_active: 0
      });

      return res.json({
        message: 'User successfully deactivated.',
        user: {
          id: userToDelete.id,
          email: userToDelete.email,
          is_active: userToDelete.is_active
        }
      });

    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  // setup password
  async setupPassword(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(400).json({
          errors: ['User not found'],
        });
      }

      await user.update({
        password: req.body.password,
        is_temporary: 0,
      });

      return res.json({ success: true });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
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

export default new UserController();
