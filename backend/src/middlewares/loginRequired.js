import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return res.status(401).json({
      errors: ['Login required.'],
    });
  }

  try {
    const data = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET
    );
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

