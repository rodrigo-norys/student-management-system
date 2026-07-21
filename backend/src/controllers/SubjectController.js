import Sequelize from 'sequelize';

import Subject from '../models/Subject.js';
import { parsePagination } from '../utils/pagination.js';

const SUBJECT_ATTRIBUTES = [
  'id',
  'name',
  'code',
  'description',
  'knowledge_area',
  'is_elective',
  'status',
];

const SUBJECT_STATUSES = ['active', 'inactive'];

// Unicidade declarada em options.indexes não popula uniqueKeys: a violação
// chega com o nome do índice, que não pode vazar na resposta.
const UNIQUE_INDEX_FIELDS = {
  subjects_index_0: 'name',
  subjects_index_1: 'code',
};

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

// Escapa wildcards do LIKE (% _ \) para tratá-los como literais na busca.
function escapeLike(term) {
  return String(term).replace(/[\\%_]/g, (char) => `\\${char}`);
}

function pickSubjectFields(body) {
  const fields = {
    name: body.name,
    code: body.code,
    description: body.description,
    knowledge_area: body.knowledge_area,
  };
  if (body.is_elective !== undefined) {
    fields.is_elective = body.is_elective ? 1 : 0;
  }
  return fields;
}

class SubjectController {
  create = async (req, res) => {
    try {
      const newSubject = await Subject.create(pickSubjectFields(req.body));
      const subject = await Subject.findByPk(newSubject.id, {
        attributes: SUBJECT_ATTRIBUTES,
      });
      return res.status(201).json(subject);
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
              { code: { [Sequelize.Op.like]: `%${escapeLike(searchTerm)}%` } },
              {
                knowledge_area: {
                  [Sequelize.Op.like]: `%${escapeLike(searchTerm)}%`,
                },
              },
            ],
          }
        : undefined;

      const subjects = await Subject.findAndCountAll({
        where,
        attributes: SUBJECT_ATTRIBUTES,
        limit,
        offset,
        order: [['name', 'ASC']],
      });

      return res.json({
        totalItems: subjects.count,
        totalPages: Math.ceil(subjects.count / limit),
        currentPage: page,
        data: subjects.rows,
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

      const subject = await Subject.findByPk(id, {
        attributes: SUBJECT_ATTRIBUTES,
      });

      if (!subject) {
        return res.status(404).json({ errors: ['Subject not found.'] });
      }

      return res.json(subject);
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
      if (status !== undefined && !SUBJECT_STATUSES.includes(status)) {
        return res.status(400).json({
          errors: [`Status must be one of: ${SUBJECT_STATUSES.join(', ')}.`],
        });
      }

      const subject = await Subject.findByPk(id);
      if (!subject) {
        return res.status(404).json({ errors: ['Subject not found.'] });
      }

      await subject.update({ ...pickSubjectFields(req.body), status });

      const updatedSubject = await Subject.findByPk(id, {
        attributes: SUBJECT_ATTRIBUTES,
      });
      return res.json(updatedSubject);
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

      const subject = await Subject.findByPk(id);
      if (!subject) {
        return res.status(404).json({ errors: ['Subject not found.'] });
      }

      await subject.update({ status: 'inactive' });
      return res.json({ message: 'Subject deactivated successfully.' });
    } catch (e) {
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
            ? `A subject with this ${duplicatedFields} already exists.`
            : 'A subject with these details already exists.',
        ],
      });
    }
    if (e instanceof Sequelize.ValidationError) {
      const messages = e.errors.map((err) => err.message).filter(Boolean);
      return res.status(400).json({
        errors: messages.length > 0 ? messages : ['Invalid data provided.'],
      });
    }
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
}

export default new SubjectController();
