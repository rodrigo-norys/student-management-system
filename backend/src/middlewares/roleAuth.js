import User from '../models/User.js';
import AccessLevel from '../models/AccessLevel.js';

export default (permissionFlag) => {
  return (req, res, next) => {
    if (!req.userPermissions || !req.userPermissions[permissionFlag]) {
      return res.status(403).json({
        errors: [
          'Forbidden. You do not have permission to access this resource.',
        ],
      });
    }
    return next();
  };
};
