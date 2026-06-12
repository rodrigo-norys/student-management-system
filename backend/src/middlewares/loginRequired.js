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
    const data = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);

    const { id, email } = data;

    const user = await User.findByPk(id, {
      include: [
        {
          model: AccessLevel,
          as: 'access_level',
          attributes: [
            'name',
            'hierarchy_weight',
            'is_system_level',
            'manage_account',
            'manage_record',
            'manage_academic',
            'manage_finance',
          ],
        },
      ],
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({
        errors: ['User not found or inactive.'],
      });
    }

    req.userId = id;
    req.userEmail = email;
    req.userWeight = user.access_level.hierarchy_weight;
    req.userRole = user.access_level.name;

    req.userPermissions = {
      is_system_level: user.access_level.is_system_level,
      manage_account: user.access_level.manage_account,
      manage_record: user.access_level.manage_record,
      manage_academic: user.access_level.manage_academic,
      manage_finance: user.access_level.manage_finance,
    };

    // Demo é somente leitura: bloqueia qualquer mutação do nível público de
    // demonstração, independente das flags do roleAuth nas rotas. Como todo
    // router protegido passa por aqui, é a trava única e à prova de rota que
    // esqueça o roleAuth.
    const demoLevelId = Number(process.env.DEMO_LEVEL_ID);
    if (
      demoLevelId &&
      user.access_level_id === demoLevelId &&
      req.method !== 'GET'
    ) {
      return res.status(403).json({
        errors: ['Demo mode is read-only.'],
      });
    }

    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ['Token expired or invalid.'],
    });
  }
};
