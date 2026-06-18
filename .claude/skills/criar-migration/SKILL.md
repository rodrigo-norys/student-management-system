---
name: criar-migration
description: Cria uma nova migration Sequelize (ESM) seguindo a estrutura canônica de create-staff. Use ao adicionar tabela ou alterar schema do backend. Cobre formato up/down, convenção de colunas (id, FKs, status, timestamps), nome de arquivo por timestamp e compatibilidade MariaDB 10.11.
---

# Criar migration

Gera uma migration nova em `backend/src/database/migrations/`. **Base estrutural:** `20260316140508-create-staff.js`.

**Argumento esperado:** o que a migration faz (ex.: `create-subjects`, `add-phone-to-staff`). Sem argumento, pergunte antes de gerar.

## 1. Nome do arquivo
Formato `YYYYMMDDHHmmss-descricao-em-kebab.js`. Gere o timestamp no momento da criação (14 dígitos). O prefixo define a **ordem de execução** — nunca usar timestamp anterior ao da última migration já aplicada.

## 2. Estrutura canônica (createTable)
Siga este esqueleto (de `create-staff`):

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('<tabela>', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    // FK — sempre com references + onUpdate/onDelete explícitos
    <entity>_id: {
      type: Sequelize.INTEGER,
      allowNull: false,            // true só se a relação for opcional
      references: { model: '<tabela_referenciada>', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',        // SET NULL quando allowNull:true (ver staff.user_id)
    },
    // Texto SEMPRE com tamanho explícito
    full_name: { type: Sequelize.STRING(150), allowNull: false },
    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('<tabela>');
}
```

## 3. Convenções obrigatórias
- **ESM**: `export async function up/down`. Nunca `module.exports`.
- **`id` primeiro, timestamps por último** (`created_at`/`updated_at`, snake_case, `DATE`, `allowNull:false`).
- **Toda FK** declara `references` + `onUpdate`/`onDelete`. Regra de `onDelete`: `RESTRICT` para relação obrigatória, `SET NULL` para opcional (`allowNull:true`) — ver `staff.user_id`. Confira o relacionamento correto no modelo de dados do `CLAUDE.md`.
- **Texto com tamanho explícito** (`STRING(n)`) — espelhe o length de colunas equivalentes em outras tabelas.
- **`status`**: o `create-staff` original usou `STRING(20)`, mas a convenção **atual** é ENUM `status` (substituiu `is_active`). Em tabela nova use `Sequelize.ENUM(...)`. Os valores variam por entidade (students/users incluem `transferred`/`graduated`/`suspended`; staff inclui `on_leave`; tabelas simples só `active`/`inactive`).
- **`down` reverte de fato**: `createTable`→`dropTable`; em alterações, o caminho inverso exato.

## 4. Compatibilidade MariaDB 10.11 (não quebrar deploy)
- Sem collation `utf8mb4_0900_ai_ci` (não existe no MariaDB).
- Tipo/funções `JSON` divergem — evite depender.
- `RETURNING` diverge — não usar.

## 5. Aplicar
De `backend/`: `npx sequelize-cli db:migrate`. Lembre que **não roda em transação por padrão** — em `createTable` simples é ok, mas em migration multi-passo uma falha no meio deixa estado parcial.

> Após gerar, sugira passar no agente `migration-review` antes de aplicar.
