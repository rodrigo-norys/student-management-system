export default (allowedLevels) => {
  return (req, res, next) => {
    const userLevel = req.userLevel;

    if (!userLevel) {
      return res.status(401).json({ errors: ['Unauthorized. Access level not identified.'] });
    }

    if (userLevel === 1) {
      return next();
    }

    if (!allowedLevels.includes(userLevel)) {
      return res.status(403).json({
        errors: ['Forbidden. Your access level does not allow this operation.']
      });
    }

    return next();
  };
};
