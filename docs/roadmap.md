# Roadmap — Student Management System

> Artefato de planejamento de projeto (do início ao fim), ancorado no **estado real do
> código** lido em 2026-06-18. Read-only: tudo aqui é **diagnóstico + proposta**, nada foi
> implementado nem commitado. Reestruturações saem como proposta para OK humano e respeitam
> os gates human-in-the-loop do `CLAUDE.md` / `.claude/context/governance.md`.
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
   ✅ FEITO       ⚠️ RACHADA        ✅ FEITO        ⬜ NÃO          ⬜            🔶 PREP     ⬜
 (com dívida)   (incompleta)     (com dívida)     INICIADO                    (não virou)
                     ▲                  ▲
                     │                  └── o produto entregou as fatias verticais de Actors…
                     └── …mas a FUNDAÇÃO embaixo está rachada: auth quebrada, zero testes/CI.
```

**Leitura de Tech Lead:** o projeto fez a jogada pragmática certa de um solo — entregou
**fatias verticais completas dos Actors** (Student/Staff/Guardian/User, do model à página) e
um fluxo de **demo read-only** para portfólio. Mas essas fatias foram construídas **por cima
de uma fundação incompleta**: a camada de autorização tem **bugs que a desligam na prática**
(§1.2), não há **um único teste** rodando (§1.5) e o **contrato HTTP divergiu** entre
controllers (§1.2). 

A decisão de engenharia mais importante do roadmap é esta: **não construir os Tiers 3–5 por
cima da fundação rachada.** Antes de escalar a superfície (Fase 3), é preciso voltar e
**fechar a Fase 1** (selar auth, canonizar contrato, subir CI + primeiros testes). Escalar
sobre auth quebrada multiplica o custo de cada bug por toda a superfície nova.

---

## 1. Diagnóstico por domínio

Status: ✅ sólido · 🔶 parcial/preparado · ⚠️ funcional mas com dívida crítica · ❌ ausente

| Domínio | Status | Resumo |
|---|---|---|
| Modelo de dados | ✅ | 5 Tiers modelados; baseline cria 16 tabelas; 15 models batem 1:1 (sobra `photos` órfã). |
| Backend / API | ⚠️ | Só Actors expostos; **auth quebrada** (`userLevel` nunca setado, `roleAuth` por flag errada); contrato HTTP divergente; Tiers 3–5 sem HTTP. |
| Frontend / UI Kit | 🔶 | Actor pages completas; Tiers 3–5 sem UI; demo read-only ok mas botões de escrita não escondidos; 2 violações de UI Kit. |
| Infra / deploy | ✅ | Cutover concluído: stack-alvo em prod (Caddy/ACME, rede segmentada, DB least-privilege, hardened), backup automatizado e testado. |
| Testes / CI | ❌ | Infra vitest/supertest instalada, **zero testes, zero CI**. |
| Segurança | 🔶 | Bons fundamentos (helmet, CORS allowlist, cookies httpOnly, demo trap sólido) com furos (bcrypt cost 8, rate-limit só no login, sem limite de upload, multitenant ausente). |
| Tooling `.claude` | ✅ | 9 agentes ativos + 13 skills + hooks de governança; cobre planejamento, build-out e review. `model-review`, `add-ts-check` e os hooks (`guard-sensitive-writes`, `typecheck-on-stop`) já **criados**; falta só `security-perf-review` (F4), planejado. |

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

### 1.2 Backend / API — ⚠️ funcional com dívida crítica

**Cobertura HTTP:** existem controller + rota só para **User, Token, Student, Staff,
Guardian, AccessLevel, Avatar, Home**. Todos os 8 routers registrados em `app.js:64-71`.

**🔴 Bug crítico 1 — `req.userLevel` nunca é setado.** `loginRequired.js:45-46` popula
`req.userWeight` e `req.userRole`, mas **nunca** `req.userLevel`. E três controllers ramificam
decisões de escopo/peso justamente em `req.userLevel`:
`GuardianController.js:85`, `StaffController.js:75`, `AvatarController.js:51`. Todas essas
checagens comparam contra `undefined` → **lógica de autorização morta**. Ex.:
`AvatarController.js:51` faz `isAdmin = req.userLevel <= 2` → `undefined <= 2` é `false` → todo
upload de avatar é negado.

**🔴 Bug crítico 2 — `roleAuth` chamado com formato antigo (IDs numéricos).**
`roleAuth.js:6` indexa `req.userPermissions[flag]` (string). Mas três route files passam
arrays/números: `avatarRoutes.js:15` `roleAuth([4])`, `guardianRoutes.js:12-16` `roleAuth([4])`
etc., `staffRoutes.js:10-14` `roleAuth(1,2,3)`. `req.userPermissions[[4]]` → `undefined` →
**403 para todos**. `userRoutes`/`studentRoutes` já usam flags corretas (`manage_account`,
`manage_record`). → **guardian, avatar e staff estão com escrita e leitura quebradas.**

**🟠 Contrato HTTP divergente (3 formas):**
- Erro: `validateRequest.js:10` devolve `{ error }` (singular); todo o resto da API usa
  `{ errors }` (plural).
- Paginação: Student/Staff/Guardian devolvem `{ totalItems, totalPages, currentPage, data }`;
  `UserController.js:202,488` devolve `{ rows, totalPages, totalCount }`; `AccessLevelController.js:14`
  devolve **array cru**.

**🟠 Outros:**
- `userRoutes.js:18` (`User.show`) tem `loginRequired` mas **sem `roleAuth` nem peso** —
  qualquer autenticado lê qualquer usuário por id (projeção limita, mas flags de `access_level`
  vazam).
- **Sem isolamento multitenant:** nenhum controller filtra `index`/`update`/`delete` por
  `staff_units` do autor. Papéis sem tratamento específico enxergam dados de todas as unidades.
- `AccessLevelController.js:29` loga `'UserController Error:'` (copy-paste).
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

### 1.5 Testes / CI — ❌ ausente

- **Zero testes no repo.** `backend/package.json:8` define `"test": "vitest run"`, `vitest@4.1.8`
  + `supertest@7.2.2` instalados, `vitest.config.js` existe — mas **nenhum** `*.test.js`/`*.spec.js`/
  `__tests__` em todo o repo. `npm test` passa vacuamente (0 testes coletados). A "primeira suíte
  de guards" citada na memória **não está na árvore**.
- Frontend: `react-scripts test` sem nenhum arquivo de teste.
- **CI: nenhuma.** Sem `.github/workflows`, sem nada. Nada roda teste/lint/build automaticamente.
- **Impacto:** a espinha de segurança (loginRequired, roleAuth, demo trap, peso) está
  **inteiramente não verificada** — e é justamente a área com os dois bugs críticos do §1.2.

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
  escrita sensível; `typecheck-on-stop` roda `tsc` nos `@ts-check`) + skill `add-ts-check`. E o
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

### Fase 1 — Fundações (auth · contrato · CI · testes) · ⚠️ RACHADA — **PRIORIDADE IMEDIATA**
- **Objetivo:** tornar a fundação confiável **antes** de escalar superfície. É a fase que o
  projeto pulou parcialmente e precisa fechar agora.
- **Entregáveis:**
  - **F1 — Selar autorização (os 2 bugs críticos):** setar `req.userLevel` (ou migrar as 3
    ramificações para `req.userWeight`, decidindo a fonte canônica de peso); corrigir
    `roleAuth` em `guardianRoutes`/`avatarRoutes`/`staffRoutes` para flags. → **resolve o 403
    geral e as checagens de peso mortas.**
  - **F2 — Canonizar contrato HTTP:** `{error}`→`{errors}` (`validateRequest.js:10`); unificar
    envelope de paginação (proposta: `{ data, totalItems, totalPages, currentPage }`, migrando
    `UserController`); `AccessLevel.index` devolver envelope, não array; fechar `User.show`
    (`userRoutes.js:18`) com `roleAuth`/peso.
  - **F3 — CI:** GitHub Actions — backend `vitest run` + frontend `CI=true npm run build`
    (warnings=erro) em PR. Hoje inexistente (§1.5).
  - **F4 — Primeiros testes (a espinha):** suíte de guards com supertest contra DB de teste
    (`school_test`, não SQLite) — `loginRequired`, `roleAuth` por flag, demo read-only trap,
    peso hierárquico. Cobre exatamente o que F1 corrige.
- **Dependências:** nenhuma (é a base). F4 depende de F1 (testar auth correta).
- **HITL / gates:** **F1 é human-in-the-loop (auth/peso)** — parar e confirmar antes. Gate:
  `backend-auth-review` + `api-contract-review` + `npm test` verde.
- **Saída:** guardian/avatar/staff respondem com a autorização correta; um único envelope de
  erro e de paginação em toda a API; CI verde em PR; suíte de guards passando.

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
- **Dependências:** H1 depende do `StaffUnit` HTTP (Fase 3A). H4 depende das entidades da Fase 3.
- **HITL / gates:** **H1 é human-in-the-loop (auth/peso).** H2 (bcrypt/JWT) idem. Gate:
  `backend-auth-review`, novo `security-perf-review` (§4), `npm test`.
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
- **HITL / gates:** drop de `photos`/hard-delete = HITL (destrutivo/exclusão de dados).
- **Saída:** backlog de dívida drenado; docs e setup sincronizados com o código.

---

## 3. Quick wins & reestruturações

### Quick wins (baixo risco, alto valor — Fase 1 majoritariamente)
| # | Item | Arquivo | Risco | Gate |
|---|---|---|---|---|
| QW1 | `{error}`→`{errors}` | `validateRequest.js:10` | trivial | api-contract-review |
| QW2 | Log mislabel | `AccessLevelController.js:29` | trivial | — |
| QW3 | `Address.belongsTo(Unit)` | `Address.js` | baixo | controller-review |
| QW4 | Sincronizar CLAUDE.md Tier-map (`subject_id`, `attendances`, `photos`) | `CLAUDE.md` | nenhum (doc) | — |
| QW5 | Esconder botões de escrita no modo demo | front (Layout/listas) | baixo | ui-kit-review |
| QW6 | bcrypt cost 8→12 | `User.js:92` | baixo* | backend-auth-review (auth-adjacent → confirmar) |
| QW7 | `limits.fileSize` no multer | `multer.js` | baixo | — |

\* QW6 toca hashing de senha; mesmo trivial, é auth-adjacent → confirmar antes (HITL leve).

> **Não-quick-win (parecem triviais, mas são HITL):** corrigir `userLevel`/`roleAuth` (F1) é
> 1–2 linhas por arquivo **mas é auth** → human-in-the-loop, não autônomo.

### Reestruturações (com justificativa + plano de migração)
1. **R-A · Unificar envelope de paginação.** *Ganho:* contrato previsível, frontend único.
   *Sai:* `UserController` `{rows,totalCount}` (`:202,488`); `AccessLevel` array cru. *Entra:*
   `{ data, totalItems, totalPages, currentPage }`. *Risco:* a página User (hooks
   `useUsersData`) lê `rows`/`totalCount` → migrar junto. *Reversível:* sim (mudança de shape).
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
