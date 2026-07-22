import Sequelize from 'sequelize';

import StaffUnit from '../models/StaffUnit.js';
import Staff from '../models/Staff.js';
import Unit from '../models/Unit.js';
import User from '../models/User.js';
import AccessLevel from '../models/AccessLevel.js';

import { hasAuthorityOver } from '../utils/hierarchy.js';
import { parsePagination } from '../utils/pagination.js';

const STAFF_UNIT_ATTRIBUTES = ['id', 'staff_id', 'unit_id', 'status'];

const STAFF_INCLUDE = {
  model: Staff,
  as: 'staff',
  attributes: ['id', 'full_name', 'job_title'],
};

const UNIT_INCLUDE = {
  model: Unit,
  as: 'unit',
  attributes: ['id', 'name'],
};

// A guarda de peso exige o user_id cru e o nível do alvo, que a projeção de
// resposta não carrega: sem o user_id, `hasAuthorityOver` lê o alvo como conta
// ausente e libera a operação.
const HIERARCHY_ATTRIBUTES = ['id', 'user_id'];

const USER_HIERARCHY_INCLUDE = {
  model: User,
  as: 'user',
  attributes: ['id', 'access_level_id'],
  include: [
    {
      model: AccessLevel,
      as: 'access_level',
      attributes: ['hierarchy_weight'],
    },
  ],
};

const STAFF_HIERARCHY_INCLUDE = {
  model: Staff,
  as: 'staff',
  attributes: HIERARCHY_ATTRIBUTES,
  include: [USER_HIERARCHY_INCLUDE],
};

const STAFF_UNIT_STATUSES = ['active', 'inactive'];

const RESTRICTED_ACTION_ERROR = 'Forbidden or restricted action.';
const NOT_FOUND_ERROR = 'Staff unit assignment not found.';
const RELATION_ERROR = 'Relation error: Referenced ID not found.';

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

function findProjected(id) {
  return StaffUnit.findByPk(id, {
    attributes: STAFF_UNIT_ATTRIBUTES,
    include: [STAFF_INCLUDE, UNIT_INCLUDE],
  });
}

class StaffUnitController {
  create = async (req, res) => {
    try {
      const { staff_id, unit_id } = req.body;

      if (!isValidId(staff_id) || !isValidId(unit_id)) {
        return res
          .status(400)
          .json({ errors: ['Missing or invalid staff or unit ID.'] });
      }

      const staffMember = await Staff.findByPk(staff_id, {
        attributes: HIERARCHY_ATTRIBUTES,
        include: [USER_HIERARCHY_INCLUDE],
      });

      if (!staffMember) {
        return res.status(400).json({ errors: [RELATION_ERROR] });
      }

      if (
        !hasAuthorityOver(req.userWeight, staffMember.user_id, staffMember.user)
      ) {
        return res.status(403).json({ errors: [RESTRICTED_ACTION_ERROR] });
      }

      // O índice único do par ignora o status: sem reativar a linha existente,
      // uma lotação desfeita bloquearia para sempre o mesmo vínculo.
      const existingAssignment = await StaffUnit.findOne({
        where: { staff_id: Number(staff_id), unit_id: Number(unit_id) },
      });

      if (existingAssignment) {
        if (existingAssignment.status === 'active') {
          return res.status(400).json({
            errors: ['This staff member is already assigned to this unit.'],
          });
        }

        await existingAssignment.update({ status: 'active' });
        return res.json(await findProjected(existingAssignment.id));
      }

      const newAssignment = await StaffUnit.create({
        staff_id: Number(staff_id),
        unit_id: Number(unit_id),
      });

      return res.status(201).json(await findProjected(newAssignment.id));
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  index = async (req, res) => {
    try {
      const { staff_id, unit_id, status } = req.query;
      const { page, limit, offset } = parsePagination(req.query);

      if (staff_id !== undefined && !isValidId(staff_id)) {
        return res.status(400).json({ errors: ['Invalid staff filter.'] });
      }
      if (unit_id !== undefined && !isValidId(unit_id)) {
        return res.status(400).json({ errors: ['Invalid unit filter.'] });
      }
      if (status !== undefined && !STAFF_UNIT_STATUSES.includes(status)) {
        return res.status(400).json({ errors: ['Invalid status filter.'] });
      }

      const where = {};
      if (staff_id !== undefined) where.staff_id = Number(staff_id);
      if (unit_id !== undefined) where.unit_id = Number(unit_id);
      if (status !== undefined) where.status = status;

      const assignments = await StaffUnit.findAndCountAll({
        where,
        attributes: STAFF_UNIT_ATTRIBUTES,
        include: [STAFF_INCLUDE, UNIT_INCLUDE],
        distinct: true,
        limit,
        offset,
        order: [
          ['unit_id', 'ASC'],
          ['staff_id', 'ASC'],
        ],
      });

      return res.json({
        totalItems: assignments.count,
        totalPages: Math.ceil(assignments.count / limit),
        currentPage: page,
        data: assignments.rows,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  show = async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      const assignment = await findProjected(id);
      if (!assignment) {
        return res.status(404).json({ errors: [NOT_FOUND_ERROR] });
      }

      return res.json(assignment);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      // `status` é o único campo mutável: mover o vínculo entre staff ou
      // unidades é revogar e lotar de novo, não editar.
      const { status } = req.body;
      if (!STAFF_UNIT_STATUSES.includes(status)) {
        return res.status(400).json({
          errors: [`Status must be one of: ${STAFF_UNIT_STATUSES.join(', ')}.`],
        });
      }

      const assignment = await StaffUnit.findByPk(id, {
        include: [STAFF_HIERARCHY_INCLUDE],
      });
      if (!assignment) {
        return res.status(404).json({ errors: [NOT_FOUND_ERROR] });
      }

      if (
        !hasAuthorityOver(
          req.userWeight,
          assignment.staff?.user_id,
          assignment.staff?.user,
        )
      ) {
        return res.status(403).json({ errors: [RESTRICTED_ACTION_ERROR] });
      }

      await assignment.update({ status });
      return res.json(await findProjected(id));
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      }

      const assignment = await StaffUnit.findByPk(id, {
        include: [STAFF_HIERARCHY_INCLUDE],
      });
      if (!assignment) {
        return res.status(404).json({ errors: [NOT_FOUND_ERROR] });
      }

      if (
        !hasAuthorityOver(
          req.userWeight,
          assignment.staff?.user_id,
          assignment.staff?.user,
        )
      ) {
        return res.status(403).json({ errors: [RESTRICTED_ACTION_ERROR] });
      }

      await assignment.update({ status: 'inactive' });
      return res.json({
        message: 'Staff unit assignment deactivated successfully.',
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  handleErrors(e, res) {
    // UniqueConstraintError estende ValidationError e precisa vir antes.
    if (e instanceof Sequelize.UniqueConstraintError) {
      return res.status(400).json({
        errors: ['This staff member is already assigned to this unit.'],
      });
    }
    if (e instanceof Sequelize.ValidationError) {
      const messages = (e.errors ?? [])
        .map((err) => err.message)
        .filter(Boolean);
      return res.status(400).json({
        errors: messages.length > 0 ? messages : ['Invalid data provided.'],
      });
    }
    if (e instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(400).json({ errors: [RELATION_ERROR] });
    }
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
}

export default new StaffUnitController();
