import AccessLevel from '../models/AccessLevel.js';
import User from '../models/User.js';

import Sequelize from 'sequelize';

class UserController {
  // create
  async create(req, res) {
    try {
      const {
        access_level_id, email, avatar_url, password, is_active, is_temporary
      } = req.body;

      const newUser = await User.create({
        access_level_id, email, avatar_url, password, is_active, is_temporary,
      });

      const {
        id,
        email: userEmail,
        access_level_id: accessLvelId,
        is_active: isActive,
        is_temporary: isTemporay
      } = newUser;

      return res.json({
        id,
        email: userEmail,
        access_level_id: accessLvelId,
        is_active: isActive,
        is_temporary: isTemporay
      });
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
      return res.status(500).json({
        errors: ['Internal server error.']
      });
    }
  }

  // show
  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          errors: ['Missing ID.'],
        });
      }

      const requester = await User.findByPk(req.userId, {
        include: [{
          model: AccessLevel,
          as: 'access_level'
        }]
      });

      if (Number(id) !== Number(req.userId) && requester.access_level_id > 2) {
        return res.status(403).json({
          error: 'You do not have permission to view other users profiles.'
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
      if (e instanceof Sequelize.DatabaseError) {
        return res.status(500).json({
          errors: ['A database error occurred.'],
        });
      }

      console.error(e);
      return res.status(500).json({
        errors: ['Internal server error. Please try again later.'],
      });
    }
  }

  // update
  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          errors: ['Missing ID.'],
        });
      }

      const userToUpdate = await User.findByPk(id);

      if (!userToUpdate) {
        return res.status(404).json({
          errors: ['User not found.']
        });
      }

      const requester = await User.findByPk(req.userId, {
        include: [{
          model: AccessLevel,
          as: 'access_level'
        }]
      });

      if (requester.access_level_id > 2) {
        return res.status(403).json({
          error: 'You dont have permission to edit users.'
        });
      }

      if (requester.access_level_id > userToUpdate.access_level_id) {
        return res.status(403).json({
          error: 'You cannot edit someone with a higher rank.'
        });
      }

      const {
        email, avatar_url, access_level_id, is_active, is_temporary
      } = req.body;

      if (requester.access_level_id > 1 && Number(access_level_id) === 1) {
        return res.status(403).json({
          error: 'You cannot transform an user in super admin'
        });
      }

      await userToUpdate.update({
        email, avatar_url, access_level_id, is_active, is_temporary
      });

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
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          errors: ['Missing ID.'],
        });
      }

      const userToDelete = await User.findByPk(id);
      if (!userToDelete) {
        return res.status(404).json({
          errors: ['User not found.'],
        });
      }
      const requester = await User.findByPk(req.userId);
      if (requester.access_level_id > 2 || Number(id) === Number(req.userId)) {
        return res.status(403).json({
          error: 'You do not have permission to delete this user profile.'
        });
      }

      if (requester.access_level_id > userToDelete.access_level_id) {
        return res.status(403).json({
          error: 'You cannot delete a user with a higher or equal access level.'
        });
      }

      await userToDelete.update({
        is_active: 0
      });

      return res.json({
        message: 'User successfully desactivated.',
        user: {
          id: userToDelete.id,
          email: userToDelete.email,
          is_active: userToDelete.is_active
        }
      });

    } catch (e) {
      if (e instanceof Sequelize.DatabaseError) {
        return res.status(500).json({
          errors: ['A database error occurred.'],
        });
      }

      return res.status(500).json({
        errors: ['Internal server error while trying to delete user.'],
      });
    }
  }
}
export default new UserController();
