---
name: create-model
description: Cria um novo model Sequelize (ESM) seguindo a estrutura de Student.js/Address.js e o registra em database/index.js. Use ao mapear uma tabela para o ORM. Cobre init/super.init, convenção de colunas (snake_case, STRING(n) com validate+msg, status ENUM, FKs INTEGER), associate (belongsTo/hasMany/belongsToMany) e o registro nos dois arrays.
---

# Criar model

Gera `backend/src/models/<Entity>.js` e o registra em `backend/src/database/index.js`. **Base estrutural:** `Student.js` (entidade rica) e `Address.js` (FKs + associate).

**Argumento esperado:** a entidade no singular PascalCase (ex.: `Subject`, `Unit`). Sem argumento, pergunte.

> O model **mapeia** a tabela; ele **não a cria**. Schema (colunas, índices, FKs no banco) é responsabilidade da **migration** (`create-migration`). Mantenha os dois alinhados: tipo/tamanho/nullability do model devem casar com a migration.

## Estrutura canônica

```js
import Sequelize, { Model } from 'sequelize';

export default class <Entity> extends Model {
  static init(sequelize) {
    super.init(
      {
        // FKs: INTEGER, allowNull conforme o relacionamento (CLAUDE.md → Modelo de dados).
        <owner>_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        // Texto: STRING(n) com o MESMO n da migration + validate.len com msg em inglês.
        name: {
          type: Sequelize.STRING(50),
          defaultValue: '',
          validate: {
            len: { args: [3, 50], msg: 'Name must be between 3 and 50 characters' },
          },
        },
        // Único: unique com msg; a constraint real vive na migration.
        email: {
          type: Sequelize.STRING(150),
          defaultValue: '',
          unique: { msg: 'Email already exists' },
          validate: {
            isEmail: { msg: 'You must enter a valid email' },
            len: { args: [5, 150], msg: 'Email must be between 5 and 150 characters' },
          },
        },
        // Status: ENUM, allowNull false, default 'active'. Substitui o antigo is_active booleano.
        status: {
          type: Sequelize.ENUM('active', 'inactive' /* ...estados do domínio */),
          allowNull: false,
          defaultValue: 'active',
        },
      },
      {
        sequelize,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.<Owner>, { foreignKey: '<owner>_id', as: '<owner>' });
    this.hasMany(models.<Child>, { foreignKey: '<entity>_id', as: '<children>' });
    // N:N: through o model de junção, foreignKey/otherKey explícitos.
    this.belongsToMany(models.<Other>, {
      through: models.<JoinModel>,
      foreignKey: '<entity>_id',
      otherKey: '<other>_id',
      as: '<others>',
    });
  }
}
```

## Registrar em `database/index.js` (obrigatório)

Sem isso o model não inicializa nem associa. **Dois passos:**
1. `import <Entity> from '../models/<Entity>.js';` junto aos outros imports.
2. Adicionar `<Entity>` ao array `models` (que alimenta os dois `.map`: `init` e `associate`).

## Regras obrigatórias

- **ESM:** `import Sequelize, { Model } from 'sequelize'` + `export default class ... extends Model`. Nada de `module.exports`.
- **`static init`** chama `super.init(cols, { sequelize })` e **retorna `this`** (o registro em `index.js` espera o retorno).
- **Colunas em snake_case.** `timestamps`/`underscored`/`tableName` **não** se declaram aqui — vêm da config global (`config/database.js`). Não declare `created_at`/`updated_at` no model.
- **Texto = `STRING(n)`** com `n` idêntico ao da migration; sempre `validate` com `msg` **em inglês** (as msgs viram `{ errors: [...] }` no `handleErrors` do controller). FKs = `INTEGER` com `allowNull` conforme o relacionamento.
- **`status` é ENUM** quando a entidade tem ciclo de vida (`active`/`inactive`/…), `allowNull: false`, default `'active'`. Nunca `is_active` booleano.
- **`associate`** declara os relacionamentos com `foreignKey` + `as` consistentes com o que os controllers usam no `include` (ex.: `as: 'addresses'`, `as: 'guardians'`). N:N via `through` do model de junção. Confira a direção contra o **Modelo de dados** do `CLAUDE.md`.
- **Comentários em pt-br**, identificadores e `msg` de validação em inglês — **e escassos**.
  Só onde há complexidade real; a maioria **não deve existir**. Sem narrativa ("antes era",
  "de propósito"): declara restrição, impessoal e atemporal. Justificativa vai para a resposta
  ao usuário, não para o bloco de código.

> Depois de gerar: crie a **migration** correspondente (`create-migration`) com os mesmos tipos/tamanhos e revise-a no `migration-review`. O model em si é validado de forma transversal quando o controller que o consome passa no `controller-review`.
