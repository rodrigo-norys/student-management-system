import User from '../models/User.js';
import jwt from 'jsonwebtoken';

class TokenController {
  async create(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(401).json({
          errors: ['Email and password are required']
        });
      }

      const user = await User.findOne({
        where: { email }
      });

      if (!user || !(await user.passwordIsValid(password))) {
        return res.status(401).json({
          errors: ['Invalid email or password']
        });
      }

      const { id, email: userEmail, access_level_id } = user;

      const token = jwt.sign(
        { id, email: userEmail, level: access_level_id },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
      });

      return res.json({
        user: {
          id,
          email: userEmail,
          access_level_id
        },
      });
    } catch (e) {
      return res.status(500).json({
        errors: ['Internal server error while generating token']
      });
    }
  }

  async delete(req, res) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (e) {
      return res.status(500).json({
        errors: ['Internal server error during logout.']
      });
    }
  }
}

export default new TokenController();
