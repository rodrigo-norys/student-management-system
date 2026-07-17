# Roadmap — Student Management System

> Artefato de planejamento de projeto (do início ao fim). Diagnóstico original lido em
> 2026-06-18; **reancorado ao estado real em 2026-07-17** (ver nota de rodapé). A **Fase 1** já
> teve parte implementada e mergeada desde o diagnóstico (auth, suíte de testes, CI backend —
> marcados ✅ no corpo); o restante (Fases 3–4, v2.0) segue **diagnóstico + proposta**.
> Reestruturações saem como proposta para OK humano e respeitam os gates human-in-the-loop do
> `CLAUDE.md` / `.claude/context/governance.md`.
>
> **Como ler:** §1 é o diagnóstico por domínio (com `arquivo:linha`); §2 é o roadmap por
> fases com o **VOCÊ ESTÁ AQUI** marcado; §3 quick wins vs reestruturações; §4 a matriz
> tooling × fases; §5 a recomendação de perpetuação.

---

## 0. Definição de pronto (o "fim") e princípio-âncora

**Princípio-âncora (decisão do dono):** *os models e relacionamentos que já existem são a
especificação.* O schema já commitou a ambição do produto — 16 tabelas nos 5 Tiers, com
`units` + `staff_units` declarando explicitamente um sistema **multi-unidade**, e a stack de
prod (MariaDB 10.11 + Docker + Caddy) declarando um sistema **deployável de verdade**. O
roadmap não inventa escopo: ele **entrega o que o modelo promete**.

Disso derivam as quatro fronteiras de escopo:

| Fronteira | Decisão | Por quê (vem do modelo) |
|---|---|---|
| **Definição de pronto** | Feature-complete dos 5 Tiers: o sistema fecha o ciclo escolar — matricular aluno → alocar professor a turma×disciplina → lançar nota e frequência. | Tiers 3–5 já têm model. Um sistema de "gestão escolar" sem turmas/notas/frequência não realiza o próprio nome. |
| **Multitenant** | **Entra** (fase de hardening). Isolamento por unidade via `staff_units`. | `units` + `staff_units` + `class_allocations` existem no schema. CLAUDE.md chama o app de "escalável". O modelo exige o isolamento. |
| **Teto de infra** | **Até o cutover** Caddy/VPS em produção. | Prod-target é MariaDB/Docker/Caddy (CLAUDE.md). O stack já está no repo, só falta fechar e virar a chave. |
| **Perpetuar a capability** | Skill `plan-project` + agente read-only de auditoria de estado. | Feature-complete dos Tiers = N ciclos de planejamento/auditoria. Capability recorrente → vira ativo versionado. |

**Critério de pronto global (v1.0):** todos os 5 Tiers expostos via HTTP + UI; auth correta
e testada; isolamento multitenant ativo; suíte de testes + CI verdes; segurança endurecida;
e o sistema rodando na VPS atrás do Caddy com TLS válido.

---

## VOCÊ ESTÁ AQUI

```
 Fase 0          Fase 1            Fase 2         Fase 3        Fase 4       Fase 5      Fase 6
 Discovery/      Fundações         MVP            Build-out     Hardening    Release/    Manutenção
 Modelagem       (auth, CI,        (Actors,       Tier 3–5      (segurança,  Infra       (evolução,
                 contrato,         demo)          (academico)   multitenant, (cutover    self-update
                 testes)                                        testes, obs) Caddy/VPS)  do setup)
 ───────────────────────────────────────────────────────────────────────────────────────────────
   ✅ FEITO       ✅ FECHADA        ✅ FEITO        ⬜ NÃO          ⬜            ✅ FEITO    ⬜
 (com dívida)                    (com dívida)     INICIADO                    (cutover)
                     ▲
                     └── auth selada, 134 testes verdes, CI backend+frontend em PR, contrato de paginação unificado.
```

**Leitura de Tech Lead:** o projeto fez a jogada pragmática certa de um solo — entregou
**fatias verticais completas dos Actors** (Student/Staff/Guardian/User, do model à página) e
um fluxo de **demo read-only** para portfólio. A fundação que versões anteriores deste doc
descreviam como "rachada" **já foi selada**: a autorização foi corrigida (os dois bugs
críticos do §1.2 estão fechados, com **teste de regressão** que trava a volta deles), a suíte
de guards existe e roda — **134 testes verdes** contra o `school_test` real (medido em
2026-07-17) — e o **CI backend** roda em cada PR para `main` (§1.5).

A Fase 1 está **fechada**. O contrato HTTP de paginação foi unificado (**F2 / R-A** + o
quick-win **QW2**): `UserController.index`/`searchTargets` e `AccessLevelController.index`
passaram a emitir o envelope `{ totalItems, totalPages, currentPage, data }` que os Actors já
usam, com o consumidor frontend migrado no mesmo PR. E o **CI de frontend** entrou como
workflow (`frontend-ci.yml`: lint + Prettier + `vite build` em PR) — backend e frontend agora
têm gate de CI. O próximo horizonte é a **Fase 3A** (build-out do núcleo acadêmico, StaffUnit
primeiro).

---

## 1. Diagnóstico por domínio

Status: ✅ sólido · 🔶 parcial/preparado · ⚠️ funcional mas com dívida crítica · ❌ ausente

| Domínio | Status | Resumo |
|---|---|---|
| Modelo de dados | ✅ | 5 Tiers modelados; baseline cria 16 tabelas; 15 models batem 1:1 (sobra `photos` órfã). |
| Backend / API | 🔶 | Actors expostos; **auth selada** (bugs de `userLevel`/`roleAuth` corrigidos, com teste de regressão); **contrato de paginação unificado** (F2 fechado, §1.2); Tiers 3–5 sem HTTP (Fase 3). |
| Frontend / UI Kit | 🔶 | Actor pages completas; Tiers 3–5 sem UI; demo read-only ok mas botões de escrita não escondidos; 2 violações de UI Kit. |
| Infra / deploy | ✅ | Cutover concluído: stack-alvo em prod (Caddy/ACME, rede segmentada, DB least-privilege, hardened), backup automatizado e testado. |
| Testes / CI | 🔶 | Suíte de guards com **134 testes verdes** (vitest+supertest contra `school_test` real); **CI backend + frontend** em PR para `main` (`backend-tests.yml` + `frontend-ci.yml`). Falta suíte de testes de **frontend** (H4). |
| Segurança | 🔶 | Bons fundamentos (helmet, CORS allowlist, cookies httpOnly, demo trap sólido) com furos (bcrypt cost 8, rate-limit só no login, sem limite de upload, multitenant ausente). |
| Tooling `.claude` | ✅ | 9 agentes ativos + 13 skills + 3 hooks de governança; cobre planejamento, build-out e review. `model-review`, `add-ts-check` e os hooks (`guard-sensitive-writes`, `typecheck-on-stop`, `format-on-stop`) já **criados**; falta só `security-perf-review` (F4), planejado. |

### 1.1 Modelo de dados — ✅ sólido (com dívida cosmética)

- **Baseline** `backend/src/database/migrations/20260616120000-baseline-schema.js` cria **16
  tabelas** via `CREATE TABLE` raw, ordenadas por dependência. Migrations antigas em
  `_archive/`. Mapa Tier→tabela:
  - **T1** `access_levels`, `units`, `subjects` · **T2** `users`, `staff`, `students`,
    `guardians`, `addresses` · **T3** `unit_classes`, `staff_units`, `student_guardians` ·
    **T4** `class_allocations`, `student_classes` · **T5** `student_grades` · **Sem Tier no
    doc:** `photos` (baseline:37), `attendances` (baseline:39).
- **15 models** em `backend/src/models/`, todos registrados em `database/index.js` (um array,
  dois passes `.init`/`.associate`). snake_case e `status` ENUM consistentes.
- **Dívidas (cosméticas, não bloqueiam):**
  - **`photos` é tabela órfã** (baseline:37) — sem `Photo.js`, fora do `database/index.js`.
    Legado: avatares hoje vão pro filesystem via `multer`. Candidata a drop (destrutivo → HITL).
  - **CLAUDE.md desatualizado vs código:** Tier 4 diz `class_allocations.subjects_id`, o
    código usa `subject_id` (baseline:33, `ClassAllocation.js`). `attendances` não está no
    mapa de Tiers. → sincronizar doc.
  - **`Address.belongsTo(Unit)` faltando** (`Address.js:104` tem Student/Staff/Guardian; coluna
    `unit_id` existe e `Unit.hasOne(Address)` em `Unit.js:76` — associação unidirecional).
  - **`User.is_temporary`**: model default `false` (`User.js:69`) contradiz DDL `DEFAULT 1`
    (baseline:17).
  - `addresses` declara só o FK `student_id` na DDL (baseline:25); `guardian_id`/`staff_id`/
    `unit_id` são colunas indexadas sem constraint FK — divergente do mapa do CLAUDE.md.
- **MariaDB 10.11:** risco baixo — a baseline é DDL nativa MariaDB (`current_timestamp()`,
  `tinyint(4)`, `utf8mb4_general_ci`), sem JSON/generated/CTE/window. Único ponto: `up` roda
  cada `CREATE TABLE` em loop **sem transação** (partial-apply em falha — caveat já documentado).
- **Seeds** (`database/seeds/`): `default-access-levels` (8 níveis, weight 100→10 + flags) é
  fundacional; `demo-seed` alimenta o modo demo; `students-addition` é fixture.

### 1.2 Backend / API — 🔶 auth selada e contrato unificado; Tiers 3–5 sem HTTP

**Cobertura HTTP:** existem controller + rota só para **User, Token, Student, Staff,
Guardian, AccessLevel, Avatar, Home**. Todos os 8 routers registrados em `app.js:64-71`.

**✅ Bug crítico 1 — RESOLVIDO (`req.userLevel`).** As três ramificações que comparavam
contra `req.userLevel` (nunca setado) foram migradas para a fonte canônica de peso/flag.
`grep -rn req.userLevel backend/src` = **zero ocorrências**. `regression.bugs.test.js` trava
a volta do bug.

**✅ Bug crítico 2 — RESOLVIDO (`roleAuth` por flag).** `guardianRoutes`/`avatarRoutes`
(via `avatarAuth`)/`staffRoutes` passaram a usar flags string (`manage_account`,
`manage_record`), alinhados ao `userRoutes`/`studentRoutes`. `roleAuth.js` indexa
`req.userPermissions[flag]` corretamente. Teste de regressão cobre.

**✅ Contrato HTTP — unificado (F2 / R-A resolvido):**
- Erro: `{ errors }` plural em toda a API — `validateRequest.js:11` (**QW1 resolvido**).
- Paginação: envelope único `{ totalItems, totalPages, currentPage, data }` em todos os
  endpoints paginados. `UserController.index`/`searchTargets` e `AccessLevelController.index`
  migraram do `{ rows, totalCount }` / array cru para o canônico, com o consumidor frontend
  (`useUsersData`, `UserManagement`) migrado no mesmo PR.

**🟠 Outros:**
- `userRoutes.js:27` (`User.show`) já fechado com `roleAuth('manage_account')` (**F2 resolvido**).
- **Sem isolamento multitenant:** nenhum controller filtra `index`/`update`/`delete` por
  `staff_units` do autor. Papéis sem tratamento específico enxergam dados de todas as unidades.
- `AccessLevelController.handleErrors` loga com o próprio nome do controller (**QW2 resolvido**).
- **`schemas/`:** só `userSchema.js` (yup, só senha), ligado a uma única rota
  (`userRoutes.js:13`). Nenhum schema de body para os demais endpoints mutadores — validação
  recai no model Sequelize.

**Pontos bons:** transação nas mutações (Student/User/Staff/Guardian create/update/delete),
projeção whitelisted nos retornos, `handleErrors` consistente, soft delete via `status:'inactive'`,
peso hierárquico **correto** em `UserController` (`:51,:284,:309,:384`) — é o controller-referência.

**Gap de build-out (model sem HTTP):** `Unit`, `UnitClass`, `Subject`, `StaffUnit`,
`ClassAllocation`, `StudentClass`, `StudentGrade`, `StudentGuardian`, `Attendance` têm model
mas **zero controller/rota**. Tiers 3–5 inteiros sem superfície HTTP.

### 1.3 Frontend / UI Kit — 🔶 parcial

- **Páginas completas (CRUD ponta a ponta):** Student, Staff, Guardian (GLOBAL/redux-saga),
  User (LOCAL/hooks+axios, sem store — é o outlier deliberado, padrão "User"). Auth (Login,
  SetupPassword), System/Photos (avatar), LandingPreview (landing pública + CTAs demo/login).
- **Home é stub** (`Home/index.js`) — dashboard com texto placeholder, sem stats.
- **Store:** módulos `auth, student, photo, staff, guardian` (`rootReducer.js:9`). Sem órfãos.
  User por design não tem store.
- **Roteamento/guarda:** `MyRoute isClosed` protege o shell autenticado; `ProtectedRoute
  allowedRoles={[1,2]}` guarda **só `/users`**. Demais rotas de entidade **não têm role-guard**
  no front — gating fica no backend.
- **Demo read-only:** entregue e **enforced no backend** (`loginRequired.js:60-69` bloqueia
  qualquer não-GET para o nível demo no choke-point único). Front mostra `DemoBanner` e o
  interceptor `services/axios.js:12-25` reescreve o erro pra pt-BR. **Caveat:** botões de
  escrita (Add/Edit/Delete) **não são escondidos** no modo demo — usuário clica e leva toast 403.
- **Violações de UI Kit:** `User/UserManagement/styled.js` redefine 5 primitivos que o barrel
  já exporta (`ViewToggle` L64, `ToggleButton` L73, `TableNameCol` L131, `SmallProfilePic` L146,
  `EditButton` L182); `System/Photos/styled.js:11` define `Container` local e hardcoda tokens de
  cor. Compliant: StudentList, GuardianList, StaffList.
- **Gap de build-out (entidade sem página):** Units, UnitClasses, Subjects, StaffUnits,
  ClassAllocations, StudentClasses, StudentGrades, Attendance, AccessLevels. Todo o núcleo
  acadêmico (Tier 3–5) está sem UI.

### 1.4 Infra / deploy — 🟢 cutover concluído

- `docker-compose.yml` (definição de prod, **em produção**): 3 serviços — `db` (mariadb:10.11), `api`
  (`backend/Dockerfile.prod`), `caddy` (SPA + reverse proxy, `frontend/Dockerfile.prod`). **Rede
  segmentada:** `db` só na `internal`, `api` faz ponte, `caddy` só na `edge`, sem rota ao DB.
  Healthchecks, `restart: unless-stopped`, log rotation, limits e hardening CIS (`no-new-privileges`,
  `cap_drop`, `read_only`+`tmpfs`), imagens pinadas por digest. Segredos via `${VAR}`, `.env` não rastreado.
- **Cutover feito (Fase 5):** prod migrou para o stack-alvo — Caddy com **TLS automático (ACME)**, rede
  segmentada, DB com usuário de aplicação **least-privilege**, **backup automatizado e testado**, e host
  hardened. Runbook operacional e auditorias em `docs/infra/` (não versionado).

### 1.5 Testes / CI — ✅ CI backend + frontend em PR (frontend sem testes ainda)

- **Suíte de guards no ar:** 7 arquivos em `backend/test/` (+ helpers `auth.js`/`db.js`),
  **134 testes passando** (medido em 2026-07-17, `npm test` → `Test Files 7 passed · Tests 134
  passed`), vitest+supertest contra o `school_test` **real** (MariaDB 10.11, nunca SQLite).
  Cobre `loginRequired`, `roleAuth` por flag, demo read-only trap, peso hierárquico/política de
  delete e cascade, política de avatar, robustez de input, envelope de erro `{ errors }` e
  **regressão estrutural** dos 2 bugs de F1.
- **CI backend no ar:** `.github/workflows/backend-tests.yml` roda em PR para `main`
  (`npm ci` → `lint` → `format:check` → `tsc` → `db:migrate` + seed → `npm test`) contra
  service `mariadb:10.11`. Runs **verdes**.
- **CI frontend no ar:** `.github/workflows/frontend-ci.yml` roda em PR para `main`
  (`npm ci` → `lint` → `format:check` → `vite build`) — sem banco e sem testes. A mídia de
  `src/assets/` é gitignored (não versionada), então um passo cria placeholders vazios para os
  assets importados antes do `vite build` (que de outro modo falharia no checkout limpo). Fecha o F3.
- **Frontend ainda sem suíte de testes** (o `react-scripts` foi substituído por Vite; testes de
  front ficam para o hardening/H4).
- **Impacto:** a espinha de segurança (loginRequired, roleAuth, demo trap, peso) está agora
  **verificada e travada** por teste de regressão — inverte o furo que este parágrafo descrevia.

### 1.6 Segurança — 🔶

| Controle | Estado | Evidência |
|---|---|---|
| Helmet | ✅ | `app.js:52-54` |
| CORS allowlist (env-driven) | ✅ | `app.js:35-50`, `credentials:true` |
| Cookies httpOnly/secure/sameSite | ✅ | `TokenController.js:22-27` |
| Demo read-only (choke-point único) | ✅ sólido | `loginRequired.js:60-69` |
| Erro genérico (sem stack leak) | ✅ | 500 → `{errors:['Internal server error.']}` |
| Password hashing | 🔶 cost baixo | `bcryptjs.hash(pw, 8)` `User.js:92` — subir p/ 10–12 |
| Rate limiting | 🔶 só login | `rateLimiter.js` ligado só em `tokenRoutes.js:9`; `/tokens/demo` e writes sem limite |
| Upload | 🔶 sem limite de tamanho | `multer.js` com fileFilter mas sem `limits.fileSize` (DoS) |
| Observabilidade | ❌ não ligada | pino-http é dependência mas **nunca instanciado** em `src` |
| Guard de env (`ACCESS_TOKEN_SECRET`) | ❌ | sem checagem de presença no boot |
| Global error handler | ❌ | só try/catch por controller |
| Multitenant isolation | ❌ | §1.2 — furo de dados entre unidades |

### 1.7 Tooling `.claude` — ✅ maduro; reorg de tooling executada em 2026-06-19

- **9 agentes ativos** (read-only, Observe): `migration-review`, `db-schema-review`, `model-review`,
  `controller-review`, `backend-auth-review`, `api-contract-review`, `ui-kit-review`, `infra-review`,
  `state-audit` (macro, lê o roadmap e reporta drift). O doc-drift "5 reviewers" em `agents-guide.md`/
  `governance.md` foi **corrigido** (contagem real sincronizada).
- **13 skills:** `create-model`, `create-migration`, `create-controller`, `create-route`,
  `create-page`, `create-test`, `add-ts-check` (Act-with-approval); `plan-feature`, `plan-project`,
  `review-changes`, `suggest-prs`, `suggest-commits`, `audit-vps` (Advise/Observe).
- **Resolvido nesta reorg:** planner de projeto (`plan-project`), skill de testes
  (`create-test`), auditor de estado (`state-audit`); re-grounding da dupla migration no baseline
  consolidado; roteamento de infra na `review-changes`; regra `req.*` indefinido no `backend-auth-review`.
- **Também nesta camada:** hooks de governança (`guard-sensitive-writes` PreToolUse força HITL em
  escrita sensível; `typecheck-on-stop` roda `tsc` nos `@ts-check`; `format-on-stop` roda
  `prettier --write` + `eslint` bloqueante nos arquivos do turno) + skill `add-ts-check`. E o
  `model-review` já foi **criado** (par de `create-model`).
- **Gap remanescente (planejado):** `security-perf-review` (Fase 4, app-layer: N+1, índices, OWASP,
  deps). Self-update do setup permanece como **processo** (`governance.md §Atualização controlada`),
  não como skill.

---

## 2. Roadmap por fases

Cada fase: **objetivo · entregáveis · dependências · HITL/gates · critério de saída.**

### Fase 0 — Discovery & Modelagem · ✅ FEITO (com dívida cosmética)
- **Objetivo:** modelar o domínio escolar nos 5 Tiers e estabilizar o schema.
- **Entregue:** 16 tabelas, 15 models 1:1, baseline única (squash do histórico), seeds
  fundacionais (access levels, demo).
- **Dívida residual (puxar pra Fase 1/6):** `photos` órfã, CLAUDE.md Tier-map stale,
  `Address.belongsTo(Unit)`, default `is_temporary`.
- **Saída:** ✅ atingida — schema reflete o domínio.

### Fase 1 — Fundações (auth · contrato · CI · testes) · ✅ FECHADA
- **Objetivo:** tornar a fundação confiável **antes** de escalar superfície. **Fechada:** auth
  selada, suíte de guards no ar, contrato de paginação unificado e CI backend+frontend em PR.
- **Entregáveis:**
  - **F1 — Selar autorização (os 2 bugs críticos): ✅ FEITO.** As 3 ramificações de
    `req.userLevel` migradas para a fonte canônica de peso/flag (grep = zero); `roleAuth` em
    `guardianRoutes`/`avatarRoutes`/`staffRoutes` por flags string. Regressão travada em
    `regression.bugs.test.js`.
  - **F2 — Canonizar contrato HTTP: ✅ FEITO.** `{error}`→`{errors}` (**QW1**); `User.show`
    fechado com `roleAuth('manage_account')`; envelope de paginação unificado no
    `{ totalItems, totalPages, currentPage, data }` dos Actors — `UserController.index`/
    `searchTargets` e `AccessLevelController.index` migrados, com o consumidor frontend
    (`useUsersData`, `UserManagement`) junto; rótulo de log corrigido (**QW2**).
  - **F3 — CI: ✅ FEITO.** `backend-tests.yml` (lint → format:check → tsc → migrate/seed →
    `npm test`, contra `mariadb:10.11`) e `frontend-ci.yml` (lint → format:check → `vite build`)
    rodam em PR para `main`.
  - **F4 — Primeiros testes (a espinha): ✅ FEITO.** 7 suítes / **134 testes** contra
    `school_test` real (supertest) — `loginRequired`, `roleAuth` por flag, demo trap, peso
    hierárquico, política de delete/cascade, avatar, robustez de input, envelope de erro e
    regressão dos 2 bugs de F1.
- **Dependências:** nenhuma (é a base). F4 depende de F1 (testar auth correta) — satisfeito.
- **HITL / gates:** F1 era human-in-the-loop (auth/peso) — **concluído**. F2/F3 não são HITL.
- **Saída ✅ atingida:** guardian/avatar/staff com autorização correta; envelope único de **erro**
  e de **paginação** em toda a API; suíte de guards + CI backend/frontend verdes em PR.

### Fase 2 — MVP / Fatias verticais (Actors) · ✅ FEITO (com dívida)
- **Objetivo:** CRUD ponta a ponta das entidades-ator + vitrine.
- **Entregue:** Student/Staff/Guardian/User (model→migration→controller→rota→página→store),
  demo read-only, LandingPreview com CTAs.
- **Dívida residual (puxar pra Fase 3/4):** Home stub; botões de escrita não escondidos no demo;
  2 violações de UI Kit (§1.3); `User.show` aberto (movido pra F2); staff self-action UI;
  módulo de hard delete/cascade (parte de Usuários).
- **Saída:** ✅ atingida — Actors operáveis pela UI.

### Fase 3 — Build-out do núcleo acadêmico (Tiers 3–5) · ⬜ NÃO INICIADO — **MAIOR FASE**
- **Objetivo:** dar à vida o que o modelo promete: estrutura → operações → resultados. Cada
  entidade é uma **fatia vertical** pela cadeia canônica (`create-controller` → `create-route` →
  `create-page`; model já existe; `create-migration` só se houver ajuste de schema).
- **Entregáveis (em ordem de dependência):**
  - **3A — Estrutura:** `Unit`, `Subject`, `UnitClass` (turmas), `StaffUnit` (lotação).
    > Construir **StaffUnit primeiro entre os de operação**: o isolamento multitenant da Fase 4
    > depende dele. Sequenciamento é decisão de arquitetura, não acaso.
  - **3B — Operações:** `StudentClass` (matrícula), `ClassAllocation` (professor×turma×disciplina).
  - **3C — Resultados:** `StudentGrade` (notas), `Attendance` (frequência).
  - Cada fatia: controller (forma canônica do `UserController` — transação, projeção
    whitelisted, peso, `handleErrors`), rota (flags corretas desde o início, sem repetir o bug
    F1), página (decidir LOCAL vs GLOBAL pelo `create-page`), revisão pelos agentes do par.
- **Dependências:** **Fase 1 fechada** (não construir sobre auth quebrada/contrato divergente).
  3B depende de 3A; 3C depende de 3B.
- **HITL / gates:** qualquer migration que toque schema core/FK das bases = HITL; migrations
  destrutivas = HITL. Gate por fatia: `controller-review` + `backend-auth-review` +
  `api-contract-review` + `ui-kit-review` + `npm test` + `CI=true build`.
- **Saída:** o ciclo escolar fecha pela API e pela UI — matricular → alocar → lançar nota e
  frequência — com contrato consistente e testes por entidade.

### Fase 4 — Hardening (multitenant · segurança · testes · observabilidade · perf) · ⬜
- **Objetivo:** transformar o feature-complete em **production-grade**.
- **Entregáveis:**
  - **H1 — Multitenant isolation:** filtrar `index`/`update`/`delete` por `staff_units` do autor
    (helper de escopo reutilizável). Fecha o furo de dados entre unidades (§1.2).
  - **H2 — Segurança:** bcrypt cost 8→12 (`User.js:92`); rate-limit além do login (`/tokens/demo`,
    setup-password, writes); `limits.fileSize` no multer; guard de presença de
    `ACCESS_TOKEN_SECRET` no boot; global error handler.
  - **H3 — Observabilidade:** ligar pino-http (já é dependência, nunca instanciado) com redação
    de `cookie`/`authorization`/`password`.
  - **H4 — Cobertura de testes:** subir de guards para integração CRUD/DB por entidade + testes
    de contrato (envelopes) contra `school_test`.
  - **H5 — Performance:** revisar índices, N+1 nos includes aninhados (Student com
    addresses/guardians/photos), defaults de paginação, auditoria de payload.
  - **H6 — Frontend CRA→Vite:** substituir `react-scripts` (descontinuado) por Vite +
    `@vitejs/plugin-react` (+ Vitest) — elimina ~50 das 56 CVEs transitivas do front, irreparáveis
    sob o CRA (§Fase 6, auditoria de deps 2026-07-09). Migração **horizontal de build** (não usa a
    cadeia de entidade), **atômica** (1 PR core: `vite.config`, `index.html` na raiz, env `VITE_*`,
    alias do `baseUrl:src`, `Dockerfile.prod`). Destrava o CI do front: o gate migra de
    `CI=true npm run build` para `vite build` + **ESLint standalone** (flat config, como o backend).
- **Dependências:** H1 depende do `StaffUnit` HTTP (Fase 3A). H4 depende das entidades da Fase 3.
  **H6 é independente** (só toca frontend/build) — pode rodar a qualquer momento.
- **HITL / gates:** **H1 é human-in-the-loop (auth/peso).** H2 (bcrypt/JWT) idem. **H6: o cutover
  da imagem do front (`Dockerfile.prod` muda o build) é HITL — validar `docker build` + smoke antes
  do deploy.** Gate: `backend-auth-review`, novo `security-perf-review` (§4), `npm test`.
- **Saída:** nenhum vazamento entre unidades; segurança sem os furos do §1.6; logs estruturados;
  cobertura de testes por domínio; sem N+1 óbvio.

### Fase 5 — Release / Cutover de infra (Caddy/VPS) · 🟢 CONCLUÍDO
- **Objetivo:** colocar o sistema na VPS atrás do Caddy, com TLS automático (ACME), rede segmentada,
  DB least-privilege e backup testado — convergindo a prod para a definição-alvo do repo.
- **Resultado:** stack-alvo **em produção** — HTTPS válido com **renovação automática** (Caddy/ACME),
  API não exposta, DB isolado e least-privilege, **backup automatizado + restore testado**, host hardened.
  Runbook operacional e auditorias (antes/depois) em `docs/infra/` (não versionado).
- **Passos (todos ✅):**
  - **Passo 0 — Repo:** hardening do stack-alvo (CIS Docker `no-new-privileges`/`cap_drop`/`read_only`,
    pin de imagens por digest, security headers, edge p/ ACME, DB sem porta no host). [PR mergeado]
  - **Passo 1 — Backup/restore:** dump automatizado + **restore testado** em container descartável.
  - **Passo 2 — DB least-privilege:** usuário de aplicação com grants mínimos (saiu do superusuário).
  - **Passo 3 — Convergir o deploy:** config de prod versionada, deploy no `main` canônico (rollback preservado).
  - **Passo 4 — Cutover:** stack-alvo no ar, TLS via ACME, smoke test ok, `audit-vps` pós-virada.
  - **Passo 5 — Hardening de host:** firewall (deny default + portas de borda/SSH), fail2ban, SSH key-only,
    log-rotation, limpeza de disco.
- **HITL / gates:** cutover conduzido **passo a passo** (human-in-the-loop); `infra-review` (estático) +
  `audit-vps` (live) antes e depois — feitos.
- **Pendência (decisão do dono):** cópia **off-site** do backup. (Cleanup de artefatos legados e PITR via
  binlog: encaminhados.)
- **Saída ✅:** app público na VPS, HTTPS válido (Caddy/ACME), DB isolado e least-privilege, backup testado, host hardened.

### Fase 6 — Manutenção & Evolução · ⬜
- **Objetivo:** sustentar o sistema e os próprios ativos de IA.
- **Entregáveis:** self-update controlado do setup (`governance.md §Atualização controlada`);
  corrigir doc-drift remanescente (CLAUDE.md Tier-map: `subject_id`, `attendances`, `photos`);
  resolver dívidas diferidas (hard-delete/cascade module, staff self-action UI, `photos` drop,
  Home dashboard real); hygiene de dependências (`npm audit`).
- **Hygiene de dependências — 🔶 em andamento (auditoria 2026-07-09):** P1/P2 mergeadas —
  typosquat `loadash` + phantom `lodash` eliminados (uso trocado por optional chaining nativo);
  driver `mariadb` ocioso removido (conexão via `mysql2`, decisão deliberada — o connector mariadb
  já deu problema de tipos); bumps de segurança (`axios`, `react-router-dom`, `styled-components`,
  `multer`, `sequelize`); Node 22 fixado (`engines` + `.nvmrc`, alinhado à VPS); `@testing-library/*`
  → devDeps; `express-delay` → devDep via import dinâmico. **Item estrutural restante:** CRA→Vite,
  escalado para **H6 (Fase 4)** por matar as CVEs transitivas.
- **Mídia do front fora do bundler — 🔶 dívida registrada (2026-07-17):** `frontend/src/assets/`
  é gitignored (mídia grande, não versionada). O `LandingPreview` importa 9 assets pelo bundler,
  então o `vite build` falha em checkout limpo — o CI de front (`frontend-ci.yml`) contorna com um
  passo de **placeholder** antes do build. O mesmo afeta o build de **produção**
  (`Dockerfile.prod` `COPY . .` + `npm run build`): funciona da máquina com os assets no disco,
  mas quebraria de um checkout limpo. **Correção definitiva:** tirar a mídia do bundler — servir
  de `public/`/CDN por URL — o que destrava o build de prod e dispensa o placeholder do CI.
- **HITL / gates:** drop de `photos`/hard-delete = HITL (destrutivo/exclusão de dados).
- **Saída:** backlog de dívida drenado; docs e setup sincronizados com o código.

---

## 3. Quick wins & reestruturações

### Quick wins (baixo risco, alto valor — Fase 1 majoritariamente)
| # | Item | Arquivo | Risco | Gate |
|---|---|---|---|---|
| QW1 | ✅ `{error}`→`{errors}` **feito** | `validateRequest.js:11` | trivial | api-contract-review |
| QW2 | ✅ Log mislabel **feito** | `AccessLevelController.js` | trivial | — |
| QW3 | `Address.belongsTo(Unit)` | `Address.js` | baixo | controller-review |
| QW4 | Sincronizar CLAUDE.md Tier-map (`subject_id`, `attendances`, `photos`) | `CLAUDE.md` | nenhum (doc) | — |
| QW5 | Esconder botões de escrita no modo demo | front (Layout/listas) | baixo | ui-kit-review |
| QW6 | bcrypt cost 8→12 | `User.js:92` | baixo* | backend-auth-review (auth-adjacent → confirmar) |
| QW7 | `limits.fileSize` no multer | `multer.js` | baixo | — |

\* QW6 toca hashing de senha; mesmo trivial, é auth-adjacent → confirmar antes (HITL leve).

> **Não-quick-win (parecem triviais, mas são HITL):** corrigir `userLevel`/`roleAuth` (F1) é
> 1–2 linhas por arquivo **mas é auth** → human-in-the-loop, não autônomo.

### Reestruturações (com justificativa + plano de migração)
1. **R-A · Unificar envelope de paginação — ✅ FEITO (F2 fechado).** `UserController`
   (`index` + `searchTargets`) e `AccessLevel.index` passaram do `{rows,totalCount}` / array cru
   para o envelope canônico dos Actors `{ totalItems, totalPages, currentPage, data }`, com a
   página User (`useUsersData`, `UserManagement`) migrada no mesmo PR. Reversível (mudança de
   shape).
2. **R-B · Centralizar peso/escopo de autorização.** *Ganho:* mata a causa-raiz do bug
   `userLevel` (cada controller hand-rola a checagem). *Sai:* ramificações ad-hoc em
   Guardian/Staff/Avatar. *Entra:* helper único baseado em `req.userWeight` + flags. *Risco:*
   auth (HITL). *Reversível:* sim, incremental por controller.
3. **R-C · `photos`: modelar ou dropar.** *Investigar primeiro* onde o avatar persiste (parece
   filesystem via multer). Se confirmado legado → **drop** (migration destrutiva = HITL).
   *Reversível:* só com backup do schema.
4. **R-D · Schemas de validação por endpoint.** *Ganho:* validação de body consistente (hoje só
   `userSchema`). *Entra:* yup por endpoint mutador (gerável pelo `create-controller`/`create-route`).
   *Risco:* baixo. Construir junto na Fase 3 (cada fatia nasce com schema).
5. **R-E · Multitenant scoping helper** — ver H1 (Fase 4). Arquitetural; depende de StaffUnit HTTP.

---

## 4. Matriz tooling × fases

### Agentes (9 ativos + 1 planejado)
| Agente | Veredito | Fase(s) | Observação |
|---|---|---|---|
| `migration-review` | **mantém** | 3, 4 | usado a cada ajuste de schema das fatias / hardening; re-aterrado no baseline consolidado |
| `db-schema-review` | **✅ criado** | 3, 4 | design de dados (DBA sênior): integridade referencial, índices, tipos, normalização |
| `controller-review` | **mantém** | 1 (auditar), 3 (build-out) | workhorse de forma do controller |
| `backend-auth-review` | **ajustado** | 1, 3, 4 | **principal** ferramenta de F1/H1. Regra de `req.*` indefinido (ex.: `req.userLevel`) **já aplicada** — pega o bug crítico |
| `api-contract-review` | **mantém** | 1, 3 | F2 (canonizar contrato) é exatamente seu papel |
| `ui-kit-review` | **mantém** | 3 | build-out de frontend Tier 3–5 |
| `infra-review` | **mantém** | 5 | prep do cutover (estático); grounding `docs/infra/` corrigido |
| `state-audit` (read-only) | **✅ criado** | agora | auditor de estado do projeto; lê `docs/roadmap.md` + código e reporta drift/progresso (deliverable 4) |
| `model-review` | **✅ criado** | 3, 4 | model↔DDL: cobertura/registro, associations↔FK, tipos/defaults; fecha o par make→check com `create-model` |
| **`security-perf-review`** | **planejado** | 4 | app-layer: rate-limit, bcrypt, upload, N+1, índices, deps (OWASP). Nasce no hardening |

### Skills (13 ativas)
| Skill | Veredito | Fase(s) | Observação |
|---|---|---|---|
| `create-model` | **mantém** | 3 | models Tier 3–5 já existem; usar para novos/ajustes |
| `create-migration` | **mantém** | 3, 4 | ajustes de schema, índices de perf; re-aterrada no baseline consolidado |
| `create-controller` | **mantém** | 3 | **workhorse** do build-out acadêmico |
| `create-route` | **mantém** | 3 | já gera flags corretas (não repetir bug F1) |
| `create-page` | **mantém** | 3 | decide LOCAL vs GLOBAL por entidade |
| `create-test` | **✅ criado** | 1 (usa), 4 (expande) | vitest+supertest; preenche o gate `npm test` (suíte ainda a escrever) |
| `add-ts-check` | **✅ criado** | todas | adota `// @ts-check` opt-in + JSDoc no backend; verificado pelo hook `typecheck-on-stop` |
| `plan-feature` | **ajustado** | 3 | já delega multi-entidade ao `plan-project`; permanece para 1 fatia |
| `plan-project` | **✅ criado** | agora | macro-planner irmã da `plan-feature`; sequencia roadmap/épicos sobre `docs/roadmap.md` (deliverable 4) |
| `review-changes` | **mantém** | todas | umbrella de review; roteia infra/model/security |
| `suggest-prs` | **ajustado** | todas | era `describe-pr`; agora fatia a pilha em 1+ PRs + descreve cada |
| `suggest-commits` | **mantém** | todas | |
| `audit-vps` | **mantém** | 5 | validação live do cutover |

**Doc-drift (resincronizado em 2026-07-03):** `agents-guide.md`/`governance.md` alinhados —
**9 agentes ativos / 13 skills + hooks** (10 agentes no alvo com `security-perf-review` F4). Resta o
Tier-map do `CLAUDE.md` (Fase 6); o `settings.local.json` já teve o `ssh` estreitado para read-only.

---

## 5. Recomendação de perpetuação (deliverable 4)

**Forma recomendada — as duas coisas, nesta ordem:**

1. **Esta sessão → `docs/roadmap.md`** (este arquivo). É o artefato-âncora. Os agentes/skills
   de planejamento e auditoria leem **daqui** "o que existe, o que falta, em que fase estamos".

2. **`plan-project` (skill) + `state-audit` (agente read-only) — ✅ criados em 2026-06-19** — o par
   **fazer→checar** no nível de projeto, espelhando o que `plan-feature` + reviewers já são
   no nível de feature:
   - **`plan-project`** (Advise): recebe um objetivo de épico (ex.: "fechar Tier 3"),
     decompõe em fatias verticais pela cadeia canônica, marca gates/HITL e **atualiza/consulta o
     `docs/roadmap.md`**. Irmã macro da `plan-feature`.
   - **`state-audit`** (Observe, `Read/Grep/Glob`): re-roda o diagnóstico do §1 sob demanda,
     compara com o roadmap e reporta **drift** (ex.: "Fase 3B começou mas sem teste",
     "doc-drift X") — sem editar nada.

   *Por que ambos, não só a sessão:* a definição de pronto (feature-complete dos 5 Tiers + 
   hardening + cutover) é **N ciclos** de planejar→construir→checar. Uma capability recorrente
   vira **ativo versionado** (princípio do `governance.md §Atualização controlada`), não trabalho
   manual repetido. A sessão isolada resolve uma vez; o par skill+agente resolve sempre.

   *Por que agora (não depois):* o `state-audit` é exatamente o que ancora a "sessão de auditoria
   do `.claude`" mencionada no handoff — ele nasce já lendo este arquivo.

   *Calibragem solo (governança):* ambos são Observe/Advise — não ampliam `tools`, não ganham
   `Edit`/`Write`, não viram cerimônia de time grande. Apenas perpetuam o diagnóstico+plano.

---

### Apêndice — pontos human-in-the-loop por fase (consolidado)
- **F1 (auth/peso)** · **H1 multitenant (auth)** · **H2 bcrypt/JWT (auth)** · **R-C drop `photos`
  (destrutivo)** · **F6 hard-delete/cascade (exclusão de dados)** · **F3 migration core/FK
  (schema core)** · **R4 cutover de produção (release)**.
- Gates reais (só comandos que existem): `npm test` (vitest, backend), `CI=true npm run build`
  (frontend), agentes reviewers (read-only, recomendam — não rodam). Sem e2e/a11y/security-matrix.

> Gerado a partir de leitura read-only do código em 2026-06-18. Não commitado.
> Atualização 2026-07-03: §1/§1.7/§4/§5 acompanham a reorg de tooling do `.claude` (9 agentes ativos / 13 skills + hooks de governança; só `security-perf-review` F4 planejado). O roadmap de código (Fases 1–6) permanece diagnóstico, não implementado.
> Atualização 2026-07-09: auditoria de dependências (Fase 6 hygiene) — P1/P2 **mergeadas**; migração CRA→Vite registrada como **H6 (Fase 4)**. Ver §Fase 4 e §Fase 6. Diferente do resto do doc (diagnóstico), estas linhas refletem trabalho efetivamente mergeado.
> Atualização 2026-07-10: auditoria do setup `.claude` em [`claude-setup-audit.md`](claude-setup-audit.md) (complementar). Sync do §1.7: registrado o 3º hook `format-on-stop` (Prettier + ESLint bloqueante no Stop), antes subdocumentado. Pendências acionáveis abertas por lá: R2 (estreitar `git checkout *` no `settings.local.json`) e R6 (avaliar `.claude/rules/`).
> **Atualização 2026-07-17 — reancoragem da Fase 1 (medida nesta sessão):** o "VOCÊ ESTÁ AQUI" saiu de *Fase 1 RACHADA* para **essencialmente verde**. Estado medido: `npm test` = **134 testes passando** (7 suítes, `school_test` real); CI backend (`.github/workflows/backend-tests.yml`) com **5 runs verdes** (`gh run list`). Fechados: **F1** (auth — grep de `req.userLevel` = 0, regressão travada), **QW1** (`{errors}` plural), **User.show** (`roleAuth`), **F4** (suíte de guards). Resíduo real e único da Fase 1 = **F2** (envelope de paginação: `UserController.index`+`searchTargets` e `AccessLevelController.index`; + **QW2** log mislabel) — endereçado no passo seguinte. Fora do F2: **CI de frontend** ainda ausente. §1/§1.2/§1.5/§2/§3 sincronizados com esse estado. Fase 3 permanece **NÃO INICIADA**.
> **Atualização 2026-07-17 (2) — Fase 1 FECHADA:** F2 mergeado (PRs #40/#41 — envelope de paginação unificado + consumidor frontend + QW2) e **CI de frontend** adicionado (`.github/workflows/frontend-ci.yml`: lint + Prettier + `vite build` em PR), fechando o F3. A Fase 1 passa de "essencialmente verde" para **✅ FECHADA**; §VOCÊ ESTÁ AQUI/§1/§1.2/§1.5/§2/§3 sincronizados. Próximo horizonte: **Fase 3A** (Unit/Subject/StaffUnit/UnitClass — StaffUnit destrava o multitenant H1). Fase 3 segue **NÃO INICIADA**.

---

## 6. Horizonte de produto — Extensão de domínio (v2.0)

> **Adicionado 2026-07-10.** Esta seção **complementa** o roadmap acima, não o substitui. Enquanto as
> Fases 0–6 fecham o **v1.0** (o ciclo acadêmico que o schema já promete + fundação + hardening +
> cutover), o **v2.0** abre os módulos de **produto de mercado** e **conformidade regulatória** que o
> segmento de gestão escolar particular BR exige e que o schema ainda **não** modela. A justificativa,
> o benchmark de mercado e as bases legais estão em [`domain-market-review.md`](domain-market-review.md)
> (auditoria complementar). O v2.0 **começa após o v1.0** — em especial após **F1/F2** (auth) e **H1**
> (tenancy), que são pré-condição para operar com dado real de menor.

**Decisões de escopo do dono (travadas 2026-07-10):**
- **Financeiro:** schema modela contrato/mensalidade/inadimplência/bolsa; **cobrança delegada a gateway
  externo** (Asaas/Pagar.me/isaac). Não virar meio de pagamento.
- **Multi-tenant:** **multi-unidade da mesma rede** (isolamento por `staff_units`, já é H1). **Não** é
  SaaS multi-escola.
- **Portal da família/aluno:** **depois do núcleo** (depende de nota/frequência/financeiro).

**Método de expansão:** cada módulo Mx é uma **fatia vertical** pela cadeia canônica
(`create-model` → `create-migration` → `create-controller` → `create-route` → `create-page`), revisada
pelos agentes do par. **HITL** obrigatório onde toca schema core/FK, auth/peso, dado sensível ou
financeiro. Os checklists `- [ ]` abaixo são o **mecanismo de continuidade entre sessões**.

### VOCÊ ESTÁ AQUI (v2.0)

```
 v1.0 ───────────────────────────────►  v2.0 (extensão de domínio) ──────────────►
 Fase 1 → Fase 3 → Fase 4/H1            M9 ∥ M1 → M2 → M3 → M4 → M5 → M6/M7/M8 → M10 → M11
 (fundação/núcleo/tenancy)              (compliance)(calendário)(avaliação)…      (censo)(portal)
 ── pré-condição p/ dado real de menor ──┘
```

### M1 · Calendário acadêmico  ·  ⬜  [funcional · fundacional]
- **Objetivo:** dar entidade ao tempo letivo (hoje só `unit_classes.school_year` varchar — `UnitClass.js:51`).
- **Tabelas:** `academic_years` (ano letivo por unidade), `academic_terms` (bimestre/trimestre/semestre).
  Refatorar `unit_classes.school_year` → FK para `academic_years`.
- **Dependências:** Fase 3A (Unit/UnitClass com HTTP).
- **HITL / gates:** **HITL (schema core** — altera `unit_classes`). `migration-review` + `db-schema-review`.
- **Checklist:**
  - [ ] models `AcademicYear`, `AcademicTerm` (+ associations) e registro em `database/index.js`
  - [ ] migration: cria tabelas + adiciona FK em `unit_classes` (backfill do `school_year` livre) — **HITL**
  - [ ] controller + rota (flags corretas; escopo por unidade quando H1 existir)
  - [ ] página (LOCAL vs GLOBAL via `create-page`)
  - [ ] testes de guarda + CRUD; `db-schema-review` + `migration-review` verdes

### M2 · Avaliação estruturada  ·  ⬜  [funcional]
- **Objetivo:** substituir `student_grades.grade_1..grade_4` fixos (`StudentGrade.js:15-46`) por avaliação
  configurável por período.
- **Tabelas:** `grade_configs` (peso, média de aprovação, escala/conceito por unidade/série),
  `assessments` (prova/trabalho por `class_allocation` + `academic_term`), `assessment_grades` (nota do
  aluno por avaliação). Migrar dados de `student_grades`.
- **Dependências:** M1 (períodos) + Fase 3C (StudentGrade/ClassAllocation HTTP).
- **HITL / gates:** **HITL (schema core** — reescreve o modelo de notas). `db-schema-review` + `migration-review`.
- **Checklist:**
  - [ ] models `GradeConfig`, `Assessment`, `AssessmentGrade` + registro
  - [ ] migration de transição de `grade_1..4` → `assessment_grades` (reversível/backfill) — **HITL**
  - [ ] controller + rota (lançamento por turma/disciplina/período)
  - [ ] página de lançamento (diário de notas)
  - [ ] testes de cálculo de média/aprovação; reviews verdes

### M3 · Boletim & histórico escolar  ·  ⬜  [funcional]
- **Objetivo:** consolidar nota+frequência em boletim, histórico e documentos oficiais.
- **Entregáveis:** relatórios derivados (boletim por aluno/turma/período) + `academic_documents`
  (boletim/declaração/certificado gerados, com versionamento).
- **Dependências:** M1 + M2 + Fase 3C (Attendance).
- **HITL / gates:** baixo (derivado). `api-contract-review` + `ui-kit-review`.
- **Checklist:**
  - [ ] endpoint de boletim (agregação nota+frequência por período)
  - [ ] model `AcademicDocument` + geração/armazenamento
  - [ ] página de visualização/impressão do boletim
  - [ ] testes de agregação; reviews verdes

### M4 · Financeiro-lite (gateway externo)  ·  ⬜  [funcional]
- **Objetivo:** mensalidade e inadimplência com cobrança delegada (decisão do dono).
- **Tabelas:** `enrollment_contracts` (vínculo financeiro do responsável), `tuition_plans` (plano/valor),
  `discounts_scholarships` (bolsa/desconto), `invoices` (parcela/mensalidade), `payments` (baixa via
  webhook), `gateway_events` (idempotência de webhook). Integração Asaas/Pagar.me/isaac.
- **Base legal:** LGPD art. 7º V (execução de contrato) para dados do responsável financeiro — ver
  `domain-market-review.md` §3.
- **Dependências:** Fase 1 (auth), `student_guardians.is_financial_resp` já existe.
- **HITL / gates:** **HITL (dado financeiro + integração externa).** Segredos do gateway via `.env`
  (nunca hardcoded — CLAUDE.md §Infra). `security-perf-review` (webhook/idempotência).
- **Checklist:**
  - [ ] models + migrations (`enrollment_contracts`…`gateway_events`) — **HITL**
  - [ ] controller + rota de contrato/plano/mensalidade; webhook de baixa (idempotente)
  - [ ] integração do gateway (credenciais em `.env` + `docker-compose` `environment:`)
  - [ ] página de financeiro (secretaria) + 2ª via
  - [ ] testes de idempotência de webhook e de régua de inadimplência; reviews verdes

### M5 · Comunicação com responsáveis  ·  ⬜  [funcional]
- **Objetivo:** canal oficial escola↔família (benchmark ClassApp/Agenda Edu — `domain-market-review.md` §2).
- **Tabelas:** `announcements` (comunicados), `messages` (mensagens diretas), `message_receipts`
  (confirmação de leitura), `authorizations`/`consent_forms` (imagem/saída/passeio, assinatura digital).
  Alternativa avaliável: integrar ClassApp/Agenda Edu em vez de mensageria nativa.
- **Dependências:** Fase 1 (auth), M9 (consentimento para autorizações).
- **HITL / gates:** médio. Autorização de imagem = ECA/ECA Digital (`domain-market-review.md` §3).
- **Checklist:**
  - [ ] models + migrations
  - [ ] controller + rota (envio, leitura, confirmação)
  - [ ] página de comunicados + coleta de autorização assinada
  - [ ] testes; reviews verdes

### M6 · Documentos & anexos  ·  ⬜  [funcional · regulatório]
- **Objetivo:** repositório de documentos (RG, laudo, contrato, foto) — reabre a decisão **R-C** (`photos`).
- **Tabelas:** `documents` (owner polimórfico + tipo + **finalidade** + vínculo de consentimento + storage).
- **Dependências:** M9 (finalidade/consentimento).
- **HITL / gates:** **HITL** se reintroduzir estrutura tipo `photos` (destrutivo prévio). `db-schema-review`.
  Limite de upload (roadmap H2 / `multer` `limits.fileSize`).
- **Checklist:**
  - [ ] model `Document` + storage (fora do FS do container ou volume dedicado)
  - [ ] migration — **HITL**
  - [ ] controller + rota (upload com limite + fileFilter) + página
  - [ ] testes; reviews verdes

### M7 · Ocorrências / disciplina  ·  ⬜  [funcional]
- **Objetivo:** registro disciplinar/pedagógico (advertência, elogio, ocorrência).
- **Tabelas:** `occurrences` (student + staff autor + tipo + `academic_term` + descrição).
- **Dependências:** M1 (período), Fase 3 (Student HTTP já existe).
- **HITL / gates:** baixo. `controller-review` + `backend-auth-review`.
- **Checklist:**
  - [ ] model `Occurrence` + migration
  - [ ] controller + rota + página (timeline do aluno)
  - [ ] testes; reviews verdes

### M8 · Saúde estruturada  ·  ⬜  [funcional · regulatório]
- **Objetivo:** substituir `students.blood_type`/`medical_notes` texto livre (`Student.js:94,104`) por dado
  estruturado e protegido — **dado sensível LGPD art. 11** (`domain-market-review.md` §3).
- **Tabelas:** `health_records` (alergias, medicações, condições, contato médico de emergência, plano),
  migrando `blood_type`/`medical_notes`. **Cifragem de coluna** para os campos sensíveis.
- **Dependências:** M9 (base legal/consentimento).
- **HITL / gates:** **HITL (schema core + dado sensível).** `db-schema-review`.
- **Checklist:**
  - [ ] model `HealthRecord` + migration de transição — **HITL**
  - [ ] cifragem de coluna dos campos sensíveis
  - [ ] controller + rota com autorização restrita (quem lê saúde de menor) + página
  - [ ] testes de autorização; reviews verdes

### M9 · Conformidade LGPD-menores (transversal)  ·  ⬜  [regulatório]
- **Objetivo:** cumprir LGPD art. 14/11/18 e ECA para dados de menor — **pré-condição de operação real**.
- **Tabelas:** `consent_records` (art. 14 — consentimento do responsável, com finalidade/versão),
  `data_processing_purposes` (finalidades declaradas, art. 14 §2º), `audit_logs` (quem acessou/alterou
  dado de menor), `data_subject_requests` (direitos do titular, art. 18). RIPD como **artefato de processo**.
- **Dependências:** F1/F2 (auth) + H1 (tenancy) + H3 (redação em logs).
- **HITL / gates:** **HITL (privacidade/dados).** Roda **em paralelo** ao M1 (não bloqueia o acadêmico,
  mas bloqueia a operação com dado real).
- **Checklist:**
  - [ ] models + migrations (`consent_records`, `data_processing_purposes`, `audit_logs`, `data_subject_requests`)
  - [ ] middleware de audit log nos acessos a dado de menor
  - [ ] fluxo de consentimento na matrícula (art. 14 §1º) + tela de finalidades públicas (§2º)
  - [ ] fluxo de atendimento a direitos do titular (art. 18)
  - [ ] RIPD documentado (`docs/`); política de retenção definida
  - [ ] testes de trilha de auditoria; reviews verdes

### M10 · Censo Escolar / Educacenso (INEP)  ·  ⬜  [regulatório]
- **Objetivo:** viabilizar a declaração obrigatória ao Censo (Decreto 6.425/2008 — `domain-market-review.md` §3).
- **Entregáveis:** campos exigidos hoje ausentes — `units.inep_code`, `students.{race_color, disability,
  nationality}` (e o que o layout Educacenso pedir); **gerador de exportação** (Escola/Turma/Aluno/Profissional).
- **Dependências:** Fase 3 (turma/matrícula/profissional com dado completo).
- **HITL / gates:** **HITL (schema core em `students`/`units`).** `migration-review` + `db-schema-review`.
- **Checklist:**
  - [ ] migration: `inep_code` em `units`; `race_color`/`disability`/`nationality` em `students` — **HITL**
  - [ ] validação dos domínios de valor conforme layout INEP
  - [ ] gerador de exportação Educacenso + conferência de completude
  - [ ] testes do layout; reviews verdes

### M11 · Portal da família/aluno  ·  ⬜  [funcional]
- **Objetivo:** área family-facing (boletim, frequência, comunicados, 2ª via de boleto). **Última fase** —
  depende de M2–M5 e do escopo de posse endurecido.
- **Entregáveis:** sem tabela nova relevante — camada de **leitura escopada** sobre M2–M5, com auth de
  papel `Student`/`Guardian` (que já autenticam — `TokenController.js:46`) endurecida por `student_guardians`.
- **Dependências:** M2, M3, M4, M5 + F1/F2 (fechar IDOR de `GET /users/:id`) + H1.
- **HITL / gates:** **HITL (auth/posse — família lendo dado de aluno).** `backend-auth-review` + testes de
  guarda de posse (um responsável **não** pode ler aluno que não é seu).
- **Checklist:**
  - [ ] endurecer escopo por `student_guardians` (posse) + fechar `GET /users/:id`
  - [ ] endpoints de leitura escopada (boletim/frequência/comunicados/2ª via)
  - [ ] UI do portal (responsável/aluno) separada do shell administrativo
  - [ ] testes de guarda de posse (negativos); reviews verdes

### Sequenciamento e HITL do v2.0

- **Ordem por dependência:** `M9 ∥ M1 → M2 → M3 → M4 → M5 → (M6/M7/M8) → M10 → M11`. M9 e o fechamento de
  tenancy (H1) são **pré-condição** de qualquer operação com dado real de menor.
- **Novos pontos human-in-the-loop** (somam ao Apêndice acima): **M1/M2/M8/M10 (schema core)** ·
  **M4 (dado financeiro + integração externa)** · **M6 (reintrodução de storage)** · **M9 (privacidade/
  dados)** · **M11 (auth/posse family-facing)**.
- **Gates reais:** os mesmos comandos existentes (`npm test`, `CI=true`/`vite build`) + agentes reviewers
  read-only. Nenhum novo tipo de gate é inventado.

> Gerado a partir da auditoria de domínio/mercado/regulação de 2026-07-10
> ([`domain-market-review.md`](domain-market-review.md)). Diagnóstico + proposta — nada implementado.
