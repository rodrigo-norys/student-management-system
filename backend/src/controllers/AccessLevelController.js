import Sequelize from 'sequelize';

import AccessLevel from '../models/AccessLevel.js';

class AccessLevelController {
  async index(req, res) {
    try {
      const accessLevels = await AccessLevel.findAll({
        attributes: ['id', 'name', 'hierarchy_weight'],
        order: [['hierarchy_weight', 'ASC']],
      });

      return res.json(accessLevels);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  }

  handleErrors(error, res) {
    if (error instanceof Sequelize.ValidationError) {
      return res
        .status(400)
        .json({ errors: error.errors.map((err) => err.message) });
    }
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(400).json({ errors: ['Email is already in use.'] });
    }
    console.error('UserController Error:', error);
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
}

export default new AccessLevelController();
