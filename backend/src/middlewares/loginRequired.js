import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      errors: ['Login required.'],
    });
  }

  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email, level } = data;

    req.userId = id;
    req.userEmail = email;
    req.userLevel = level;

    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ['Token expired or invalid.'],
    });
  }
};

