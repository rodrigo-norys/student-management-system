import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AccessLevel from '../models/AccessLevel.js';

export default async (req, res, next) => {
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

    const { id, email } = data;

    const user = await User.findByPk(id, {
      include: [
        {
          model: AccessLevel,
          as: 'access_level',
          attributes: ['hierarchy_weight'],
        },
      ],
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        errors: ['User not found or inactive.'],
      });
    }

    req.userId = id;
    req.userEmail = email;
    req.userWeight = user.access_level.hierarchy_weight;

    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ['Token expired or invalid.'],
    });
  }
};
