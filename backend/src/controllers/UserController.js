import Sequelize from 'sequelize';
import database from '../database/index.js';

import User from '../models/User.js';
import AccessLevel from '../models/AccessLevel.js';
import Student from '../models/Student.js';
import Guardian from '../models/Guardian.js';
import Staff from '../models/Staff.js';

import {
  isProtectedTarget,
  hasAuthorityOver,
  PROTECTED_TARGET_ERROR,
} from '../utils/hierarchy.js';

const { Op: Operators } = Sequelize;

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

// Escapa wildcards do LIKE (% _ \) para tratá-los como literais na busca.
function escapeLike(term) {
  return String(term).replace(/[\\%_]/g, (char) => `\\${char}`);
}

class UserController {
  create = async (req, res) => {
    const transaction = await database.transaction();
    try {
      const {
        access_level_id,
        email,
        password,
        status,
        is_temporary,
        student_id,
        guardian_id,
        staff_id,
        targetId,
        targetType,
      } = req.body;

      if (!access_level_id || !email) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ errors: ['Access level and email are required.'] });
      }

      const targetAccessLevel = await AccessLevel.findByPk(access_level_id);
      if (!targetAccessLevel) {
        await transaction.rollback();
        return res.status(400).json({ errors: ['Invalid access level.'] });
      }

      if (req.userWeight <= targetAccessLevel.hierarchy_weight) {
        await transaction.rollback();
        return res.status(403).json({
          errors: [
            'You cannot create a user with a hierarchy level equal to or higher than yours.',
          ],
        });
      }

      let finalStaffId = staff_id;
      let finalStudentId = student_id;
      let finalGuardianId = guardian_id;

      if (targetType && targetId) {
        if (targetType === 'staff') finalStaffId = targetId;
        if (targetType === 'student') finalStudentId = targetId;
        if (targetType === 'guardian') finalGuardianId = targetId;
      }

      let TargetModel;
      let personId;

      if (finalStaffId) {
        TargetModel = Staff;
        personId = finalStaffId;
      } else if (finalStudentId) {
        TargetModel = Student;
        personId = finalStudentId;
      } else if (finalGuardianId) {
        TargetModel = Guardian;
        personId = finalGuardianId;
      }

      if (!TargetModel) {
        await transaction.rollback();
        return res.status(400).json({
          errors: [
            'A valid staff_id, student_id, guardian_id, or target entity must be provided.',
          ],
        });
      }

      const person = await TargetModel.findByPk(personId);
      if (!person) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ errors: ['Associated person profile not found.'] });
      }

      if (person.user_id) {
        await transaction.rollback();
        return res.status(400).json({
          errors: ['This profile already has an active user account.'],
        });
      }

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        await transaction.rollback();
        return res.status(400).json({ errors: ['Email already in use.'] });
      }

      let folderName = 'users';
      if (targetType === 'student') folderName = 'students';
      if (targetType === 'guardian') folderName = 'guardians';
      if (targetType === 'staff') folderName = 'staff';

      let finalAvatarUrl = null;
      if (req.body.avatar_url) {
        finalAvatarUrl = `users/${req.body.avatar_url}`;
      } else if (person.avatar_url) {
        finalAvatarUrl = `${folderName}/${person.avatar_url}`;
      }

      const newUser = await User.create(
        {
          access_level_id,
          email,
          avatar_url: finalAvatarUrl,
          password,
          status: status ?? 'active',
          is_temporary: is_temporary ?? true,
        },
        { transaction },
      );

      await person.update({ user_id: newUser.id }, { transaction });

      await transaction.commit();

      return res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        access_level_id: newUser.access_level_id,
        avatar_url: newUser.avatar_url,
        status: newUser.status,
        is_temporary: newUser.is_temporary,
      });
    } catch (e) {
      await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  index = async (req, res) => {
    try {
      const { status, searchTerm, page = 1, limit = 15 } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const offset = (pageNum - 1) * limitNum;

      const where = {};

      if (status) where.status = status;

      if (searchTerm) {
        where.email = { [Operators.like]: `%${escapeLike(searchTerm)}%` };
      }

      const { count, rows } = await User.findAndCountAll({
        where,
        attributes: [
          'id',
          'email',
          'avatar_url',
          'status',
          'is_temporary',
          'access_level_id',
        ],
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
            attributes: [
              'name',
              'hierarchy_weight',
              'manage_account',
              'manage_record',
              'manage_academic',
              'manage_finance',
            ],
          },
        ],
        order: [['id', 'DESC']],
        limit: limitNum,
        offset: offset,
      });

      const totalPages = Math.ceil(count / limitNum);

      return res.json({
        rows,
        totalPages,
        totalCount: count,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  show = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ errors: ['Missing user ID.'] });
      }

      const user = await User.findByPk(id, {
        attributes: [
          'id',
          'email',
          'avatar_url',
          'status',
          'is_temporary',
          'access_level_id',
        ],
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
            attributes: [
              'name',
              'hierarchy_weight',
              'manage_account',
              'manage_record',
              'manage_academic',
              'manage_finance',
            ],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ errors: ['User not found.'] });
      }

      return res.json(user);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  update = async (req, res) => {
    const transaction = await database.transaction();
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        await transaction.rollback();
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      const userToUpdate = await User.findByPk(id, {
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
          },
        ],
        transaction,
      });

      if (!userToUpdate) {
        await transaction.rollback();
        return res.status(404).json({ errors: ['User not found.'] });
      }

      const isEditingSelf = Number(id) === Number(req.userId);
      const myWeight = req.userWeight;
      const targetWeight = userToUpdate.access_level?.hierarchy_weight || 0;

      if (!isEditingSelf && myWeight <= targetWeight) {
        await transaction.rollback();
        return res.status(403).json({
          errors: [
            'Forbidden. You do not have enough authority to edit this user.',
          ],
        });
      }

      const {
        email,
        avatar_url,
        access_level_id,
        status,
        is_temporary,
        password,
      } = req.body;

      // O update não pode virar rota de fuga da política de delete. O ramo
      // isEditingSelf acima pula a checagem de peso, e daí saíam caminhos para
      // o General Director se matar sem volta:
      //   - status: 'inactive' — loginRequired barra conta não-active;
      //   - access_level_id menor — rebaixar-se remove a própria proteção (ela
      //     é chaveada no nível) e entrega a conta à paridade de peso: um par
      //     de peso 80 então a desativa pelo delete normal;
      //   - access_level_id: null — a coluna é nullable, e loginRequired lê
      //     user.access_level.hierarchy_weight sem optional chaining: nível
      //     nulo estoura e vira 401 em toda rota autenticada.
      // Todos terminais: repor o nível 1 exige peso > 100, que ninguém tem nem
      // pode ter. Nível 1 só nasce do seed.
      //
      // Daí o `!== undefined` em vez de truthiness nas duas: `null`, `''` e `0`
      // são falsy e escapariam da guarda justamente para chegar nos estados
      // piores. Um `status: ''` que passasse batido só seria barrado pelo
      // sql_mode estrito do MariaDB — invariante de auth não pode depender de
      // config de banco.
      const isDeactivating = status !== undefined && status !== 'active';
      const isChangingLevel =
        access_level_id !== undefined &&
        Number(access_level_id) !== Number(userToUpdate.access_level_id);

      if (
        (isDeactivating || isChangingLevel) &&
        isProtectedTarget(userToUpdate.id, userToUpdate)
      ) {
        await transaction.rollback();
        return res.status(403).json({ errors: [PROTECTED_TARGET_ERROR] });
      }

      if (isDeactivating && isEditingSelf) {
        await transaction.rollback();
        return res.status(403).json({
          errors: ['Forbidden. You cannot deactivate your own account.'],
        });
      }

      if (isChangingLevel) {
        const newLevel = await AccessLevel.findByPk(access_level_id, {
          transaction,
        });
        if (!newLevel || myWeight <= newLevel.hierarchy_weight) {
          await transaction.rollback();
          return res.status(403).json({
            errors: [
              'Forbidden. You cannot assign an access level higher than or equal to your own.',
            ],
          });
        }
      }

      const updateData = {
        email,
        avatar_url,
        access_level_id,
        status,
        is_temporary,
      };

      if (password) updateData.password = password;

      await userToUpdate.update(updateData, { transaction });

      const updatedUser = await User.findByPk(id, {
        attributes: [
          'id',
          'email',
          'avatar_url',
          'access_level_id',
          'status',
          'is_temporary',
        ],
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
            attributes: ['name', 'description'],
          },
        ],
        transaction,
      });

      await transaction.commit();
      return res.json(updatedUser);
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  delete = async (req, res) => {
    const transaction = await database.transaction();
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        await transaction.rollback();
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      const userToDelete = await User.findByPk(id, {
        include: [
          {
            model: AccessLevel,
            as: 'access_level',
          },
        ],
        transaction,
      });

      if (!userToDelete) {
        await transaction.rollback();
        return res.status(404).json({ errors: ['User not found.'] });
      }

      if (isProtectedTarget(userToDelete.id, userToDelete)) {
        await transaction.rollback();
        return res.status(403).json({ errors: [PROTECTED_TARGET_ERROR] });
      }

      const isSelf = Number(id) === Number(req.userId);

      if (
        isSelf ||
        !hasAuthorityOver(req.userWeight, userToDelete.id, userToDelete)
      ) {
        await transaction.rollback();
        return res.status(403).json({
          errors: [
            'Forbidden. Insufficient authority to deactivate this user or self-deactivation attempt.',
          ],
        });
      }

      // Soft Delete
      await userToDelete.update({ status: 'inactive' }, { transaction });

      await transaction.commit();
      return res.json({
        message:
          'User successfully deactivated while preserving historical data.',
      });
    } catch (e) {
      if (transaction) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  /**
   * Busca Global de Alvos sem Credencial (User) vinculada.
   * Varre simultaneamente as tabelas de Students, Guardians e Staff procurando
   * registros com user_id nulo.
   */
  searchTargets = async (req, res) => {
    try {
      const { searchTerm, page = 1, limit = 15 } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const offset = (pageNum - 1) * limitNum;

      const studentWhere = { user_id: null };
      const guardianWhere = { user_id: null };
      const staffWhere = { user_id: null };

      if (searchTerm) {
        const searchPattern = `%${escapeLike(searchTerm)}%`;

        studentWhere[Operators.or] = [
          { name: { [Operators.like]: searchPattern } },
          { last_name: { [Operators.like]: searchPattern } },
          { cpf: { [Operators.like]: searchPattern } },
          { email: { [Operators.like]: searchPattern } },
          { registration_number: { [Operators.like]: searchPattern } },
        ];

        guardianWhere[Operators.or] = [
          { name: { [Operators.like]: searchPattern } },
          { last_name: { [Operators.like]: searchPattern } },
          { cpf: { [Operators.like]: searchPattern } },
          { email: { [Operators.like]: searchPattern } },
        ];

        staffWhere[Operators.or] = [
          { full_name: { [Operators.like]: searchPattern } },
          { cpf: { [Operators.like]: searchPattern } },
          { email: { [Operators.like]: searchPattern } },
        ];
      }

      const [students, guardians, staffMembers] = await Promise.all([
        Student.findAll({
          where: studentWhere,
          attributes: ['id', 'avatar_url', 'name', 'last_name', 'email', 'cpf'],
        }),
        Guardian.findAll({
          where: guardianWhere,
          attributes: ['id', 'name', 'last_name', 'email', 'cpf'],
        }),
        Staff.findAll({
          where: staffWhere,
          attributes: ['id', 'full_name', 'email', 'cpf'],
        }),
      ]);

      const results = [
        ...students.map((student) => ({
          ...student.get(),
          type: 'student',
          displayName: `${student.name} ${student.last_name}`,
        })),
        ...guardians.map((guardian) => ({
          ...guardian.get(),
          type: 'guardian',
          displayName: `${guardian.name} ${guardian.last_name}`,
        })),
        ...staffMembers.map((staffMember) => ({
          ...staffMember.get(),
          type: 'staff',
          displayName: staffMember.full_name,
        })),
      ];

      const totalCount = results.length;
      const totalPages = Math.ceil(totalCount / limitNum);
      const paginatedResults = results.slice(offset, offset + limitNum);

      return res.json({
        rows: paginatedResults,
        totalPages,
        totalCount,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  /**
   * Ativação de Conta (First Access).
   * Exclusivo para usuários com a flag 'is_temporary' ativa.
   */
  setupPassword = async (req, res) => {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ errors: ['Password is required.'] });
      }

      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(404).json({ errors: ['User not found.'] });
      }

      if (!user.is_temporary) {
        return res.status(400).json({
          errors: ['Password setup is only allowed for temporary accounts.'],
        });
      }

      await user.update({
        password,
        is_temporary: 0,
      });

      return res.json({ success: true });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  handleErrors(error, res) {
    if (error instanceof Sequelize.ValidationError) {
      return res
        .status(400)
        .json({ errors: error.errors.map((err) => err.message) });
    }
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(400).json({ errors: ['Email is already in use.'] });
    }
    console.error('UserController Error:', error);
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
}

export default new UserController();
