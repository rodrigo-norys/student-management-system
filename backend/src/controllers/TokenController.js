import User from '../models/User.js';
import jwt from 'jsonwebtoken';

class TokenController {
  async create(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(401).json({
          errors: ['Email and password are required'],
        });
      }

      const user = await User.findOne({
        where: { email },
      });

      if (!user || !(await user.passwordIsValid(password))) {
        return res.status(401).json({
          errors: ['Invalid email or password'],
        });
      }

      const { id, email: userEmail, access_level_id, is_temporary } = user;
      const expiresInSeconds = Number(process.env.ACCESS_TOKEN_EXPIRATION);

      const access_token = jwt.sign(
        {
          id,
          email: userEmail,
          level: access_level_id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: expiresInSeconds,
        },
      );

      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: expiresInSeconds * 1000,
      });

      return res.json({
        user: {
          id,
          email: userEmail,
          access_level_id,
          is_temporary,
        },
      });
    } catch (e) {
      return this.handleErrors(
        e,
        res,
        'Internal server error while generating token',
      );
    }
  }

  async validate(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(401).json({
          errors: ['User not found.'],
        });
      }

      const { id, email, access_level_id } = user;

      return res.json({
        user: {
          id,
          email,
          access_level_id,
        },
      });
    } catch (e) {
      return this.handleErrors(
        e,
        res,
        'Internal server error during validation.',
      );
    }
  }

  async delete(req, res) {
    try {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return res.status(200).json({
        message: 'Logged out successfully.',
      });
    } catch (e) {
      return this.handleErrors(e, res, 'Internal server error during logout.');
    }
  }

  handleErrors(e, res, defaultMsg = 'Internal server error.') {
    console.error('TokenController Error:', e);
    return res.status(500).json({
      errors: [defaultMsg],
    });
  }
}

export default new TokenController();
