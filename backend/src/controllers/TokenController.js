import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

class TokenController {
  // Assina o JWT e seta o cookie HttpOnly. Choke point único de emissão de
  // token — reutilizado pelo login normal e pelo acesso demo.
  issueToken = (res, user) => {
    const expiresInSeconds = Number(process.env.ACCESS_TOKEN_EXPIRATION);

    const access_token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        level: user.access_level_id,
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
  };

  // Marca a sessão como demo a partir do nível de acesso público read-only.
  isDemoLevel = (access_level_id) => {
    const demoLevelId = Number(process.env.DEMO_LEVEL_ID);
    return Boolean(demoLevelId) && access_level_id === demoLevelId;
  };

  create = async (req, res) => {
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

      this.issueToken(res, user);

      const { id, email: userEmail, access_level_id, is_temporary } = user;

      return res.json({
        user: {
          id,
          email: userEmail,
          access_level_id,
          is_temporary,
          is_demo: this.isDemoLevel(access_level_id),
        },
      });
    } catch (e) {
      return this.handleErrors(
        e,
        res,
        'Internal server error while generating token',
      );
    }
  };

  // Login one-click do recrutador: emite o token do usuário demo conhecido
  // (resolvido por DEMO_USER_EMAIL) sem exigir credenciais no front.
  createDemo = async (req, res) => {
    try {
      const email = process.env.DEMO_USER_EMAIL;

      if (!email) {
        return res.status(503).json({
          errors: ['Demo mode is not configured.'],
        });
      }

      const user = await User.findOne({
        where: { email },
      });

      if (!user || user.status !== 'active') {
        return res.status(503).json({
          errors: ['Demo user is not available.'],
        });
      }

      this.issueToken(res, user);

      const { id, email: userEmail, access_level_id, is_temporary } = user;

      return res.json({
        user: {
          id,
          email: userEmail,
          access_level_id,
          is_temporary,
          is_demo: this.isDemoLevel(access_level_id),
        },
      });
    } catch (e) {
      return this.handleErrors(
        e,
        res,
        'Internal server error while starting demo session',
      );
    }
  };

  validate = async (req, res) => {
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
          is_demo: this.isDemoLevel(access_level_id),
        },
      });
    } catch (e) {
      return this.handleErrors(
        e,
        res,
        'Internal server error during validation.',
      );
    }
  };

  delete = async (req, res) => {
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
  };

  handleErrors = (e, res, defaultMsg = 'Internal server error.') => {
    logger.error({ err: e }, 'TokenController error');
    return res.status(500).json({
      errors: [defaultMsg],
    });
  };
}

export default new TokenController();
