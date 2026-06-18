---
name: criar-controller
description: Cria um novo controller CRUD do backend seguindo a forma canônica do StudentController/UserController. Use ao expor uma entidade (controller + actions). Cobre as 5 actions, arrow methods (this preso), projeção whitelisted, transação nas mutações, soft delete via status ENUM, peso hierárquico no controller e handleErrors. Decide entre forma mínima e forma completa antes de gerar.
---

# Criar controller

Gera `backend/src/controllers/<Entity>Controller.js`. **Base estrutural:** `StudentController.js` (forma completa) e `UserController.js` (hierarquia). A memória `ref-controller-crud-minimo` é o esqueleto de legibilidade.

**Argumento esperado:** a entidade (ex.: `subject`, `unit`). Sem argumento, pergunte.

## Antes de gerar: decida a forma

O projeto tem dois níveis. **Pergunte/infira qual cabe** antes de escrever:

- **Mínima** — entidade simples, sem relações compostas nem cruzamento de privilégio. 5 actions, `try/catch` fino, projeção whitelisted, `handleErrors`. **Sem** transação (nada multi-tabela), **sem** peso hierárquico. É o esqueleto da memória `ref-controller-crud-minimo`.
- **Completa** — entidade com **escrita multi-tabela** (endereços, vínculos N:N) **ou** que mexe em outro ator. Acrescenta: **transação** nas mutações, **peso hierárquico** no controller, regras de visibilidade por role.

Cruze com o modelo de dados do `CLAUDE.md`: tem `hasMany`/`belongsToMany` salvos junto? → completa. É tabela folha (ex.: `subject`, `unit`)? → mínima. Na dúvida, pergunte.

## Estrutura canônica (forma completa)

```js
import <Entity> from '../models/<Entity>.js';
// ...models relacionados (ex.: Address, User)

import Sequelize from 'sequelize';
import database from '../database/index.js';

// Constantes de projeção no topo do módulo (reuso entre actions).
const <ENTITY>_ATTRIBUTES = ['id', /* ...campos whitelisted, sem timestamps/segredos */];

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

// Escapa wildcards do LIKE (% _ \) para tratá-los como literais na busca.
function escapeLike(term) {
  return String(term).replace(/[\\%_]/g, (char) => `\\${char}`);
}

// Whitelist dos campos da entidade editáveis pelo usuário.
function pick<Entity>Fields(body) {
  return { /* só os campos que o cliente pode escrever */ };
}

class <Entity>Controller {
  // Arrow methods: o handler é passado destacado pro Express (router.post('/', c.create));
  // arrow class field mantém `this` preso, senão `this.handleErrors` quebra.
  create = async (req, res) => {
    const transaction = await database.transaction();
    try {
      // ...cria registro + filhos com { transaction }
      // hierarquia (se cruza ator): if (req.userWeight <= alvo.hierarchy_weight) → 403
      await transaction.commit();
      return res.status(201).json(/* projeção whitelisted */);
    } catch (e) {
      if (transaction && !transaction.finished) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  index = async (req, res) => {
    try {
      // where + escapeLike no searchTerm; paginação page/limit; findAndCountAll com distinct
      const { page = 1, limit = 15 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      const result = await <Entity>.findAndCountAll({ /* attributes whitelisted, limit, offset */ });
      return res.json({
        totalItems: result.count,
        totalPages: Math.ceil(result.count / Number(limit)),
        currentPage: Number(page),
        data: result.rows,
      });
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  show = async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidId(id)) return res.status(400).json({ errors: ['Missing or invalid ID.'] });
      const record = await <Entity>.findByPk(id, { /* attributes whitelisted, include */ });
      if (!record) return res.status(404).json({ errors: ['<Entity> not found.'] });
      // regras de visibilidade por role (ex.: Student só vê o próprio) → 403
      return res.json(record);
    } catch (e) {
      return this.handleErrors(e, res);
    }
  };

  update = async (req, res) => {
    const transaction = await database.transaction();
    try {
      const { id } = req.params;
      if (!isValidId(id)) { await transaction.rollback(); return res.status(400).json({ errors: ['Missing or invalid ID.'] }); }
      const record = await <Entity>.findByPk(id, { transaction });
      if (!record) { await transaction.rollback(); return res.status(404).json({ errors: ['<Entity> not found.'] }); }
      // peso hierárquico (se cruza ator) antes de mutar
      await record.update(pick<Entity>Fields(req.body), { transaction });
      // ...sincroniza filhos/vínculos com { transaction }
      await transaction.commit();
      return res.json(/* projeção whitelisted refetch */);
    } catch (e) {
      if (transaction && !transaction.finished) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  delete = async (req, res) => {
    const transaction = await database.transaction();
    try {
      const { id } = req.params;
      if (!isValidId(id)) { await transaction.rollback(); return res.status(400).json({ errors: ['Missing or invalid ID.'] }); }
      const record = await <Entity>.findByPk(id, { transaction });
      if (!record) { await transaction.rollback(); return res.status(404).json({ errors: ['<Entity> not found.'] }); }
      // SOFT DELETE — nunca destroy: preserva histórico
      await record.update({ status: 'inactive' }, { transaction });
      await transaction.commit();
      return res.json({ message: '<Entity> deactivated successfully.' });
    } catch (e) {
      if (transaction && !transaction.finished) await transaction.rollback();
      return this.handleErrors(e, res);
    }
  };

  handleErrors(e, res) {
    if (e instanceof Sequelize.ValidationError)
      return res.status(400).json({ errors: e.errors.map((err) => err.message) });
    if (e instanceof Sequelize.ForeignKeyConstraintError)
      return res.status(400).json({ errors: ['Referenced ID does not exist.'] });
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
}

export default new <Entity>Controller();
```

## Regras obrigatórias

- **Arrow methods nas actions.** O handler é passado destacado pro Express; arrow class field prende `this` (senão `this.handleErrors` estoura). Helpers de módulo (`isValidId`, `escapeLike`, `pickFields`) ficam **fora** da classe.
- **Projeção whitelisted em TODO retorno.** Nunca `res.json(model)` cru. Use `attributes: [...]` explícito ou `attributes: { exclude: ['created_at', 'updated_at'] }`. **Jamais** vaze `password_hash`, tokens, ou campo de segredo.
- **Transação em toda mutação multi-tabela** (`create`/`update`/`delete` que tocam filhos/vínculos). Catch faz `if (transaction && !transaction.finished) await transaction.rollback()`. Em rollback de guard (id inválido/404) **antes** do retorno.
- **Envelope de paginação canônico:** `{ totalItems, totalPages, currentPage, data }`. **Não** invente `{ rows, totalCount }` (o `UserController` diverge — é dívida, não modelo).
- **Shape de erro `{ errors: [...] }`** (plural, array de strings) em **todas** as respostas de erro. Status: `201` create, `200` ok, `400` validação/id inválido, `403` permissão/hierarquia, `404` ausência, `500` interno.
- **Soft delete via `status` ENUM** (`update({ status: 'inactive' })`), nunca `destroy`. Em cascata, desative os filhos diretos (ex.: o `user` vinculado) na mesma transação.
- **Peso hierárquico no controller.** Se a action mexe em **outro ator**, valide `req.userWeight` contra o `hierarchy_weight` do alvo (e regras de self-action) — `roleAuth` na rota **não** cobre isso. Veja `UserController.update/delete`.
- **Busca:** `escapeLike(searchTerm)` + `Sequelize.Op.like` + `Sequelize.Op.or`. **Comentários em pt-br**, identificadores em inglês.

## Forma mínima (entidade folha)

Mesma forma, **sem** transação e **sem** hierarquia: `try/catch` fino por action, projeção whitelisted, `handleErrors`. É o baseline de legibilidade da memória `ref-controller-crud-minimo` — use quando a entidade não escreve em múltiplas tabelas nem cruza privilégio.

> Depois de gerar: a entidade ainda precisa do **model** (`criar-model`), da **migration** (`criar-migration`) e da **rota** (`criar-rota`). Para revisar, passe no agente `controller-review` (forma do CRUD) e, se mexeu em rota/autz, no `backend-auth-review`.
