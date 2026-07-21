import Sequelize from 'sequelize';
import database from '../database/index.js';

import Unit from '../models/Unit.js';
import Address from '../models/Address.js';
import { parsePagination } from '../utils/pagination.js';

const UNIT_ATTRIBUTES = ['id', 'name', 'cnpj', 'email', 'phone', 'status'];

const ADDRESS_ATTRIBUTES = [
  'id',
  'zip_code',
  'street',
  'number',
  'complement',
  'neighborhood',
  'city',
  'state',
];

const ADDRESS_INCLUDE = {
  model: Address,
  as: 'address',
  attributes: ADDRESS_ATTRIBUTES,
};

// Valor fora do ENUM escapa da validação do Sequelize e vira 500 no MariaDB.
const UNIT_STATUSES = ['active', 'inactive'];

// Unicidade declarada em options.indexes não popula uniqueKeys: a violação
// chega com o nome do índice, que não pode vazar na resposta.
const UNIQUE_INDEX_FIELDS = {
  units_name_unique: 'name',
  units_cnpj_unique: 'CNPJ',
  units_email_unique: 'email',
};

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

function isAddressPayload(address) {
  return Boolean(address) && typeof address === 'object';
}

// Escapa wildcards do LIKE (% _ \) para tratá-los como literais na busca.
function escapeLike(term) {
  return String(term).replace(/[\\%_]/g, (char) => `\\${char}`);
}

function pickUnitFields(body) {
  return {
    name: body.name,
    cnpj: body.cnpj,
    email: body.email,
    phone: body.phone,
  };
}

function addressRow(address, unitId) {
  return {
    zip_code: address.zip_code,
    street: address.street,
    number: address.number,
    complement: address.complement,
    neighborhood: address.neighborhood,
    city: address.city,
    state: address.state,
    unit_id: unitId,
  };
}

class UnitController {
  create = async (req, res) => {
    const transaction = await database.transaction();
    try {
      const { address } = req.body;

      if (Array.isArray(address)) {
        await transaction.rollback();
        return res.status(400).json({
          errors: ['Address must be a single object, not a list.'],
        });
      }

      const newUnit = await Unit.create(pickUnitFields(req.body), {
        transaction,
      });

      if (isAddressPayload(address)) {
        await Address.create(addressRow(address, newUnit.id), { transaction });
      }

      const fullUnit = await Unit.findByPk(newUnit.id, {
        attributes: UNIT_ATTRIBUTES,
        include: [ADDRESS_INCLUDE],
        transaction,
      });

      await transaction.commit();
      return res.status(201).json(fullUnit);
    } catch (e) {
      if (transaction && !transaction.finished) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  lookup = async (req, res) => {
    try {
      const units = await Unit.findAll({
        attributes: ['id', 'name'],
        where: { status: 'active' },
        order: [['name', 'ASC']],
      });

      return res.json({
        totalItems: units.length,
        totalPages: 1,
        currentPage: 1,
        data: units,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  index = async (req, res) => {
    try {
      const { searchTerm } = req.query;
      const { page, limit, offset } = parsePagination(req.query);

      const where = searchTerm
        ? {
            [Sequelize.Op.or]: [
              { name: { [Sequelize.Op.like]: `%${escapeLike(searchTerm)}%` } },
              { cnpj: { [Sequelize.Op.like]: `%${escapeLike(searchTerm)}%` } },
              { email: { [Sequelize.Op.like]: `%${escapeLike(searchTerm)}%` } },
            ],
          }
        : undefined;

      const units = await Unit.findAndCountAll({
        where,
        attributes: UNIT_ATTRIBUTES,
        include: [ADDRESS_INCLUDE],
        distinct: true,
        limit,
        offset,
        order: [['name', 'ASC']],
      });

      const totalPages = Math.ceil(units.count / limit);

      return res.json({
        totalItems: units.count,
        totalPages,
        currentPage: page,
        data: units.rows,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  show = async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res.status(400).json({
          errors: ['Missing or invalid ID.'],
        });
      }

      const unit = await Unit.findByPk(id, {
        attributes: UNIT_ATTRIBUTES,
        include: [ADDRESS_INCLUDE],
      });

      if (!unit) {
        return res.status(404).json({
          errors: ['Unit not found.'],
        });
      }

      return res.json(unit);
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
        return res.status(400).json({
          errors: ['Missing or invalid ID.'],
        });
      }

      const { address, status } = req.body;

      if (Array.isArray(address)) {
        await transaction.rollback();
        return res.status(400).json({
          errors: ['Address must be a single object, not a list.'],
        });
      }

      if (status !== undefined && !UNIT_STATUSES.includes(status)) {
        await transaction.rollback();
        return res.status(400).json({
          errors: [`Status must be one of: ${UNIT_STATUSES.join(', ')}.`],
        });
      }

      const unit = await Unit.findByPk(id, { transaction });
      if (!unit) {
        await transaction.rollback();
        return res.status(404).json({
          errors: ['Unit not found.'],
        });
      }

      await unit.update(
        { ...pickUnitFields(req.body), status: req.body.status },
        { transaction },
      );

      if (isAddressPayload(address)) {
        const currentAddress = await Address.findOne({
          where: { unit_id: id },
          transaction,
        });

        if (currentAddress) {
          await currentAddress.update(addressRow(address, id), { transaction });
        } else {
          await Address.create(addressRow(address, id), { transaction });
        }
      }

      const updatedUnit = await Unit.findByPk(id, {
        attributes: UNIT_ATTRIBUTES,
        include: [ADDRESS_INCLUDE],
        transaction,
      });

      await transaction.commit();
      return res.json(updatedUnit);
    } catch (e) {
      if (transaction && !transaction.finished) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  delete = async (req, res) => {
    const transaction = await database.transaction();
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        await transaction.rollback();
        return res.status(400).json({
          errors: ['Missing or invalid ID.'],
        });
      }

      const unit = await Unit.findByPk(id, { transaction });
      if (!unit) {
        await transaction.rollback();
        return res.status(404).json({
          errors: ['Unit not found.'],
        });
      }

      await unit.update({ status: 'inactive' }, { transaction });

      await transaction.commit();
      return res.json({
        message: 'Unit deactivated successfully.',
      });
    } catch (e) {
      if (transaction && !transaction.finished) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  handleErrors(e, res) {
    // UniqueConstraintError estende ValidationError e precisa vir antes.
    if (e instanceof Sequelize.UniqueConstraintError) {
      const duplicatedFields = (e.errors ?? [])
        .map((err) => UNIQUE_INDEX_FIELDS[err.path])
        .filter(Boolean)
        .join(', ');
      return res.status(400).json({
        errors: [
          duplicatedFields
            ? `A unit with this ${duplicatedFields} already exists.`
            : 'A unit with these details already exists.',
        ],
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
    return res.status(500).json({
      errors: ['Internal server error.'],
    });
  }
}

export default new UnitController();
