import User from '../models/User.js';
import jwt from 'jsonwebtoken';

class TokenController {
  async create(req, res) {
    const { email = '', password = '' } = req.body;
    const user = await User.findOne({ where: { email } });

    const { id } = user;
    const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION
    });

    if (!email || !password) {
      return res.status(401).json({
        errors: ['Invalid credencials']
      });
    }

    if (!user) {
      return res.status(401).json({
        errors: ['Invalid user']
      });
    }

    if (!(await user.passwordIsValid(password))) {
      return res.status(401).json({
        errors: ['Invalid password']
      });
    }

    return res.json({ token, user: { name: user.name, id, email } });
  }
}

export default new TokenController();
