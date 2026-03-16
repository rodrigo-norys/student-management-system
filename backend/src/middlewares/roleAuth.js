import User from '../models/User.js';

export default (allowedLevels) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(401).json({ errors: ['User not found.'] });
      }

      req.userAccessLevel = user.access_level_id;

      if (req.userAccessLevel === 1) {
        return next();
      }

      if (!allowedLevels.includes(req.userAccessLevel)) {
        return res.status(403).json({
          errors: ['Forbidden. Your access level does not allow this operation.']
        });
      }

      return next();
    } catch (e) {
      return res.status(500).json({ errors: ['Internal server error during authorization.'] });
    }
  };
};
