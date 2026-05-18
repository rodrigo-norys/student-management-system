import User from '../models/User.js';
import AccessLevel from '../models/AccessLevel.js';

export default (permissionFlag) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId, {
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
          },
        ],
      });

      if (!user || !user.access_level || !user.access_level[permissionFlag]) {
        return res.status(403).json({
          errors: ['Forbidden. You do not have permission to access this resource.'],
        });
      }

      return next();
    } catch (e) {
      return res.status(500).json({
        errors: ['Internal server error during authorization validation.'],
      });
    }
  };
};
