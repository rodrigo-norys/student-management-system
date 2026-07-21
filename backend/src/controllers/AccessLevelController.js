import Sequelize from 'sequelize';

import AccessLevel from '../models/AccessLevel.js';

class AccessLevelController {
  index = async (req, res) => {
    try {
      const accessLevels = await AccessLevel.findAll({
        attributes: ['id', 'name', 'hierarchy_weight'],
        order: [['hierarchy_weight', 'ASC']],
      });

      return res.json({
        totalItems: accessLevels.length,
        totalPages: 1,
        currentPage: 1,
        data: accessLevels,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  handleErrors(error, res) {
    // UniqueConstraintError estende ValidationError e precisa vir antes.
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res
        .status(400)
        .json({ errors: ['This access level name is already in use.'] });
    }
    if (error instanceof Sequelize.ValidationError) {
      const messages = error.errors.map((err) => err.message).filter(Boolean);
      return res.status(400).json({
        errors: messages.length > 0 ? messages : ['Invalid data provided.'],
      });
    }
    console.error('AccessLevelController Error:', error);
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
}

export default new AccessLevelController();
