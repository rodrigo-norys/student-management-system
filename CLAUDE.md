# Student Management System

Aplicação escalável de gestão escolar. Projeto acadêmico e de portfólio (GitHub).

## Stack

- **Backend:** Node.js v22.18.0 (LTS), Express, Sequelize (ESM).
- **Frontend:** React, styled-components, Redux.
- **Banco (local e produção):** MariaDB 10.11.15 — **mesma engine nos dois ambientes**. Local sobe via Docker (imagem `mariadb:10.11`, idêntica à de prod); o MySQL 8 nativo foi abandonado.

> Local e prod rodam a **mesma** MariaDB 10.11, então não há divergência de SQL entre dev e deploy. Mantenha as queries dentro do que o MariaDB 10.11 suporta (sem recursos exclusivos de MySQL 8+).

## Infra

- Produção: Docker 29.1.5 + Docker Compose. As variáveis vêm do `.env` e são injetadas pelo `docker-compose.yml` — nunca hardcoded em imagem ou código.
- Local: Ubuntu (Linux), `.env`.
- O `.env` da raiz é a fonte única das variáveis; o `docker-compose.yml` as referencia via `${VAR}`. Ao **adicionar** uma variável, declare no `.env` **e** referencie sob o `environment:` do serviço que a consome (sem `env_file:`, o Compose só injeta no container o que está listado ali). Não há mais cópia de valor entre arquivos.

## Modelo de dados (relacionamentos)

### Tier 1 — Access & Base

- `users.access_level_id` → `access_levels.id` (N:1)
- `addresses.unit_id` — `units.id` (1:1)

### Tier 2 — Actors (User & Address links)

- `staff.user_id` — `users.id` (1:1)
- `addresses.staff_id` → `staff.id` (N:1)
- `students.user_id` — `users.id` (1:1)
- `addresses.student_id` → `students.id` (N:1)
- `guardians.user_id` — `users.id` (1:1)
- `addresses.guardian_id` → `guardians.id` (N:1)

### Tier 3 — Structure & Links

- `unit_classes.unit_id` → `units.id` (N:1)
- `staff_units.staff_id` → `staff.id` (N:1)
- `staff_units.unit_id` → `units.id` (N:1)
- `student_guardians.student_id` → `students.id` (N:1)
- `student_guardians.guardian_id` → `guardians.id` (N:1)

### Tier 4 — Operations & Allocations

- `student_classes.unit_class_id` → `unit_classes.id` (N:1)
- `student_classes.student_id` → `students.id` (N:1)
- `class_allocations.staff_id` → `staff.id` (N:1)
- `class_allocations.unit_class_id` → `unit_classes.id` (N:1)
- `class_allocations.subject_id` → `subjects.id` (N:1)

### Tier 5 — Results (Grades & Attendance)

- `student_grades.class_allocation_id` → `class_allocations.id` (N:1)
- `student_grades.student_classes_id` → `student_classes.id` (N:1)
- `attendances.student_id` → `students.id` (N:1)
- `attendances.class_allocation_id` → `class_allocations.id` (N:1)

## Comandos (ambiente local Ubuntu/Linux)

### Backend (`backend/`)

- `npm run dev` — sobe a API com nodemon (`src/server.js`).
- `npm start` — sobe a API sem watch.
- Não há etapa de build local (ESM nativo).

### Frontend (`frontend/`)

- `npm start` — dev server.
- `npm run build` — build de produção. **`CI=true` trata warnings como erro** — use para validar que não há lint pendente antes de subir.

### Migrations (rodar de `backend/`)

- `npx sequelize-cli db:migrate` — aplica migrations pendentes.
- `npx sequelize-cli db:migrate:undo` — reverte a última.
- Config em `src/config/database.js`; migrations em `src/database/migrations/`.
- Em produção (VPS Linux) as migrations rodam dentro do container Docker.

## Migrations — práticas

- **Nunca editar migration já aplicada** (registrada na `SequelizeMeta`): não re-executa e cria divergência entre ambientes. Crie uma nova.
- Migrations **não rodam em transação por padrão** — em falha no meio, os passos anteriores podem já ter sido aplicados.

> Template, formato ESM, reorder com `after` e duplicata em índice único: skill `create-migration` + agente `migration-review`.

## Convenções de código

### Frontend — UI Kit

- Componentes compartilhados de styled-components vivem em `components/ui/` (módulos: `layout`, `profile`, `forms`, `list`, `buttons`, `fields` + barrel `index.js`).
- Pastas-componente unitárias são PascalCase (`Loading/`, `Layout/`); coleções/namespaces são minúsculas (`ui/`).
- As páginas mantêm um `styled.js` que **reexporta** os primitivos do `components/ui` (fachada `Styled.*`), com apenas o específico definido localmente.

### Backend — autorização

- `loginRequired` popula `req.userId`, `req.userWeight`, `req.userRole` e `req.userPermissions` (flags `manage_account`, `manage_record`, `manage_academic`, `manage_finance`, `is_system_level`) a partir do `access_level`.
- `roleAuth('flag')` valida a **flag de permissão** (`req.userPermissions[flag]`). O **peso hierárquico** é validado dentro do controller (ex.: `UserController`).
- Status das entidades é um **ENUM `status`** (substituiu o antigo `is_active` booleano).

## Governança de agentes

- **Human-in-the-loop** — pare e confirme antes de: **migration destrutiva**, **auth/peso hierárquico**, **exclusão de dados** (hard delete/cascade), **schema core** (tabelas/FKs das entidades base).
- Níveis de autonomia, gates reais, formato do Fechamento e fluxo de auto-update do setup: ver `.claude/context/governance.md` (não auto-carregado — citado explicitamente por agentes/skills). Permissões de comando em `.claude/settings.json`. Visão geral em `.claude/agents-guide.md`.
