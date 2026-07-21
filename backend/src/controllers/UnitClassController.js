import Sequelize from 'sequelize';

import UnitClass from '../models/UnitClass.js';
import Unit from '../models/Unit.js';
import { parsePagination } from '../utils/pagination.js';

const UNIT_CLASS_ATTRIBUTES = [
  'id',
  'unit_id',
  'name',
  'grade_level',
  'room_number',
  'shift',
  'school_year',
  'max_students',
  'status',
];

const UNIT_INCLUDE = {
  model: Unit,
  as: 'unit',
  attributes: ['id', 'name'],
};

const UNIT_CLASS_STATUSES = ['active', 'inactive'];

// Os índices únicos de unit_classes são compostos, então a violação identifica
// uma combinação e não um campo isolado.
const UNIQUE_INDEX_MESSAGES = {
  unit_classes_index_0:
    'This unit already has a class in the same room, shift and school year.',
  unit_classes_index_1:
    'This unit already has a class with this name in the same school year.',
};

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

// Escapa wildcards do LIKE (% _ \) para tratá-los como literais na busca.
function escapeLike(term) {
  return String(term).replace(/[\\%_]/g, (char) => `\\${char}`);
}

function pickUnitClassFields(body) {
  return {
    unit_id: body.unit_id,
    name: body.name,
    grade_level: body.grade_level,
    room_number: body.room_number,
    shift: body.shift,
    school_year: body.school_year,
    max_students: body.max_students,
  };
}

class UnitClassController {
  create = async (req, res) => {
    try {
      const newUnitClass = await UnitClass.create(
        pickUnitClassFields(req.body),
      );
      const unitClass = await UnitClass.findByPk(newUnitClass.id, {
        attributes: UNIT_CLASS_ATTRIBUTES,
        include: [UNIT_INCLUDE],
      });
      return res.status(201).json(unitClass);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  index = async (req, res) => {
    try {
      const { searchTerm, unit_id, school_year } = req.query;
      const { page, limit, offset } = parsePagination(req.query);

      // Filtro inválido alarga o resultado em silêncio; o show rejeita o mesmo
      // valor com 400.
      if (unit_id !== undefined && !isValidId(unit_id)) {
        return res.status(400).json({ errors: ['Invalid unit filter.'] });
      }

      const where = {};
      if (unit_id !== undefined) where.unit_id = Number(unit_id);
      if (school_year !== undefined) where.school_year = String(school_year);
      if (searchTerm) {
        where[Sequelize.Op.or] = [
          { name: { [Sequelize.Op.like]: `%${escapeLike(searchTerm)}%` } },
          {
            grade_level: { [Sequelize.Op.like]: `%${escapeLike(searchTerm)}%` },
          },
          {
            room_number: { [Sequelize.Op.like]: `%${escapeLike(searchTerm)}%` },
          },
        ];
      }

      const unitClasses = await UnitClass.findAndCountAll({
        where,
        attributes: UNIT_CLASS_ATTRIBUTES,
        include: [UNIT_INCLUDE],
        distinct: true,
        limit,
        offset,
        order: [
          ['school_year', 'DESC'],
          ['name', 'ASC'],
        ],
      });

      return res.json({
        totalItems: unitClasses.count,
        totalPages: Math.ceil(unitClasses.count / limit),
        currentPage: page,
        data: unitClasses.rows,
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

      const unitClass = await UnitClass.findByPk(id, {
        attributes: UNIT_CLASS_ATTRIBUTES,
        include: [UNIT_INCLUDE],
      });

      if (!unitClass) {
        return res.status(404).json({ errors: ['Unit class not found.'] });
      }

      return res.json(unitClass);
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

      const { status } = req.body;
      if (status !== undefined && !UNIT_CLASS_STATUSES.includes(status)) {
        return res.status(400).json({
          errors: [`Status must be one of: ${UNIT_CLASS_STATUSES.join(', ')}.`],
        });
      }

      const unitClass = await UnitClass.findByPk(id);
      if (!unitClass) {
        return res.status(404).json({ errors: ['Unit class not found.'] });
      }

      await unitClass.update({ ...pickUnitClassFields(req.body), status });

      const updatedUnitClass = await UnitClass.findByPk(id, {
        attributes: UNIT_CLASS_ATTRIBUTES,
        include: [UNIT_INCLUDE],
      });
      return res.json(updatedUnitClass);
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

      const unitClass = await UnitClass.findByPk(id);
      if (!unitClass) {
        return res.status(404).json({ errors: ['Unit class not found.'] });
      }

      await unitClass.update({ status: 'inactive' });
      return res.json({ message: 'Unit class deactivated successfully.' });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  handleErrors(e, res) {
    // UniqueConstraintError estende ValidationError e precisa vir antes.
    if (e instanceof Sequelize.UniqueConstraintError) {
      const message = (e.errors ?? [])
        .map((err) => UNIQUE_INDEX_MESSAGES[err.path])
        .find(Boolean);
      return res.status(400).json({
        errors: [message ?? 'A unit class with these details already exists.'],
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
      return res.status(400).json({
        errors: ['Relation error: Referenced ID not found.'],
      });
    }
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
}

export default new UnitClassController();
