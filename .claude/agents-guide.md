# Guia de Agentes e Skills — Student Management System

Referência de consulta sobre os subagents e skills do projeto: o que são, quando usar, quando **não** usar, e como ajustar/criar.

---

## Conceito: agente ≠ sessão

Separar trabalho em **sessões** (ex.: student backend, student frontend, dúvidas gerais) mantém o **contexto da conversa** limpo por domínio.

Um **agente** faz algo relacionado mas diferente: roda uma tarefa em **contexto isolado e devolve só a conclusão** — de dentro de qualquer sessão, sem sujar o contexto dela.

Exemplo: na sessão "student backend", ao revisar uma migration nova, em vez de carregar o histórico de migrations no contexto compartilhado, dispara-se um agente que lê tudo, valida e devolve só "ok" ou "linha 33 quebra no MariaDB". O trabalho sujo fica no contexto **dele**.

> Agente **complementa** a separação de sessões, não substitui.

---

## Skill vs Agente — fazer vs checar

São ferramentas complementares:

- **Skill** roda no **contexto atual** — injeta procedimento/conhecimento e eu executo aqui. É o **fazer**.
- **Agente** roda em **contexto isolado** — devolve só a conclusão. É o **checar**.

No projeto eles vêm em pares **fazer → checar**, organizados em camadas:

**Camada 0 — Projeto (macro):** par fazer→checar no nível de **épico/fase**, sobre o `docs/roadmap.md`.

| Fazer (skill) | Checar (agente) |
|---|---|
| `plan-project` | `state-audit` |

**Camada 1 — Geração + revisão de par (1:1):**

| Domínio | Skill (fazer) | Agente (checar) |
|---------|---------------|-----------------|
| Model | `create-model` | `model-review` |
| Migration | `create-migration` | `migration-review` |
| Controller | `create-controller` | `controller-review` |
| Rota | `create-route` | `backend-auth-review` |
| Página | `create-page` | `ui-kit-review` |
| Teste | `create-test` | — (gate `npm test`; verificado **rodando**, sem agente) |
| Schema (banco) | (via `create-migration`) | `db-schema-review` |
| Type-safety | `add-ts-check` | — (hook `typecheck-on-stop`; sem agente) |

**Camada 2 — Governança transversal (não casa 1:1 com um arquivo):**

| Preocupação | Agente / Skill |
|---|---|
| Coerência do contrato HTTP entre endpoints | `api-contract-review` (agente) |
| Segurança/performance app-layer (rate-limit, bcrypt, N+1, deps) | `security-perf-review` (agente) *(planejado · Fase 4)* |
| Passe de review completo do diff | `review-changes` (skill, umbrella) |

**Camada 3 — Infra:** `audit-vps` (faz/audita a VPS de produção, live) ↔ `infra-review` (checa os artefatos de IaC do repo).

**Camada 4 — Processo:** `suggest-commits` (plano de commits), `suggest-prs` (fatia a pilha em 1+ PRs + descreve cada). Não revisam código — preparam a entrega.

**Hooks (enforcement determinístico, fora do allow/deny):** `guard-sensitive-writes` (PreToolUse Edit/Write) força confirmação humana em escrita sensível (`.env`, auth, models core, migration versionada); `typecheck-on-stop` (Stop) roda `tsc` nos arquivos `// @ts-check` e segura o encerramento se quebrar; `format-on-stop` (Stop) roda `prettier --write` nos arquivos do turno + `eslint` bloqueante (sem `--fix`) em `backend/src`. São a terceira forma de "checar" (determinística), além do agente e do gate de comando. Ver Governança.

Fluxo: a skill gera seguindo o padrão; o agente revisa em contexto limpo; a umbrella `review-changes` orquestra os revisores certos sobre o diff antes do PR.

---

## Os agentes do projeto

Todos são **read-only** (`tools: Read, Grep, Glob`). Um revisor com `Write` viraria editor disfarçado e tiraria o ponto de controle.

Hoje: **9 ativos** (8 reviewers de par/transversais/dados + o `state-audit` macro) e **1 planejado** (`security-perf-review` na Fase 4) — **10 no alvo**.

| Agente | Arquivo | Função |
|--------|---------|--------|
| `migration-review` | [agents/migration-review.md](agents/migration-review.md) | Revisa migration nova antes do `db:migrate`: compat MariaDB 10.11, formato ESM, reversibilidade do `down`, aplicação parcial, duplicata transitória em índice único. |
| `db-schema-review` | [agents/db-schema-review.md](agents/db-schema-review.md) | **Design de dados (DBA sênior)**: integridade referencial (FK real, não só coluna indexada), normalização, índices, tipos/tamanhos, nullability/defaults, naming, charset/collation uniforme. |
| `model-review` | [agents/model-review.md](agents/model-review.md) | **Fidelidade ORM↔schema**: cobertura/registro em `database/index.js`, associations refletindo as FKs reais, tipos/tamanhos/defaults/ENUM batendo com o DDL. Par de `create-model`. |
| `controller-review` | [agents/controller-review.md](agents/controller-review.md) | Revisa a **mecânica** de um controller: integridade transacional + rollback, projeção whitelisted, soft delete via `status`, peso hierárquico, `isValidId`, códigos HTTP, arrow methods. |
| `backend-auth-review` | [agents/backend-auth-review.md](agents/backend-auth-review.md) | Revisa rota/controller: `loginRequired` → `roleAuth(flag)` → peso hierárquico no controller, `status` ENUM, projeção whitelisted, e uso de `req.*` indefinido. |
| `api-contract-review` | [agents/api-contract-review.md](agents/api-contract-review.md) | **Transversal**: coerência do contrato entre endpoints — envelope de erro `{errors}` plural, envelope de paginação canônico, status HTTP, shape de resposta. Compara o alvo com os irmãos. |
| `ui-kit-review` | [agents/ui-kit-review.md](agents/ui-kit-review.md) | Revisa página/componente: fachada `styled.js` reexportando `components/ui`, casing de pasta, sem duplicar primitivo do UI Kit. |
| `infra-review` | [agents/infra-review.md](agents/infra-review.md) | Revisa IaC do repo (compose, Dockerfile, Caddyfile, `.env.example`): segredo fora do arquivo, porta só na borda, DB least-privilege, container não-root, rede segmentada, TLS/headers. |
| `state-audit` | [agents/state-audit.md](agents/state-audit.md) | **Macro**: re-roda o diagnóstico por domínio e compara com `docs/roadmap.md` — reporta drift e progresso por fase. Par de checagem da `plan-project`. |
| `security-perf-review` *(planejado · F4)* | — | **Transversal**: segurança/performance app-layer — rate-limit, bcrypt, upload, env guard, N+1, índices, deps (OWASP). |

> **Divisão dos três revisores de backend** (evita sobreposição): `backend-auth-review` = camada de **rota** (login/flag/peso existe?); `controller-review` = **mecânica interna** de um arquivo (transação, projeção, soft delete); `api-contract-review` = **consistência entre** arquivos (todos respondem igual?).

> **Trio de dados** (evita sobreposição): `migration-review` = a migration **vai quebrar ao aplicar**? · `db-schema-review` = o **design do schema** está certo (integridade, índices, tipos, normalização)? · `model-review` = o **ORM reflete** o schema?

---

## As skills do projeto

Skills moram em `.claude/skills/<nome>/SKILL.md` e carregam por **progressive disclosure**: só `name` + `description` ficam no contexto até a skill ser invocada (≠ `CLAUDE.md`, sempre carregado). Cada uma foi aterrada num arquivo-base real e termina apontando pro agente revisor do par. São **13** no total.

| Skill | Arquivo | Base | O que gera |
|-------|---------|------|------------|
| `create-model` | [skills/create-model/SKILL.md](skills/create-model/SKILL.md) | `Student.js` + `Address.js` | Model Sequelize ESM: `init`/`super.init`, colunas snake_case com `validate`+`msg`, `status` ENUM, FKs, `associate`, **registro em `database/index.js`**. |
| `create-migration` | [skills/create-migration/SKILL.md](skills/create-migration/SKILL.md) | padrão `createTable` (baseline `20260616120000`) | Migration ESM (`up`/`down`): `id` → FKs com `references`+`onUpdate`/`onDelete` → texto com `STRING(n)` → `status` ENUM → timestamps. |
| `create-controller` | [skills/create-controller/SKILL.md](skills/create-controller/SKILL.md) | `StudentController.js` + `UserController.js` | Controller CRUD: 5 actions, arrow methods, projeção whitelisted, transação, soft delete, peso hierárquico, `handleErrors`. **Decide forma mínima vs completa.** |
| `create-route` | [skills/create-route/SKILL.md](skills/create-route/SKILL.md) | `userRoutes.js` | Arquivo de rotas Express: `loginRequired`, `roleAuth(flag)`, ordem estática-antes-de-`/:id`, registro em `app.js`. |
| `create-page` | [skills/create-page/SKILL.md](skills/create-page/SKILL.md) | User (local) + store do Student (global) | Página React; **decide local (hooks) vs global (redux-sagas) antes de gerar**. |
| `create-test` | [skills/create-test/SKILL.md](skills/create-test/SKILL.md) | `vitest.config.js` + app exportado sem `listen` | Testes vitest+supertest: suíte de guards (auth/demo/peso) e integração CRUD contra `school_test`. Fecha no gate `npm test`. |
| `add-ts-check` | [skills/add-ts-check/SKILL.md](skills/add-ts-check/SKILL.md) | `validateRequest.js` + `jsconfig.json` | Adota `// @ts-check` opt-in + JSDoc mínimo nos melhores candidatos do backend (rankeia por payoff). Verificado pelo hook `typecheck-on-stop`. |

**Skills de processo/governança** (não geram entidade — orquestram e preparam a entrega):

| Skill | Arquivo | O que faz |
|-------|---------|-----------|
| `plan-project` | [skills/plan-project/SKILL.md](skills/plan-project/SKILL.md) | Macro-planner de **épico/fase**: decompõe em fatias verticais sobre o `docs/roadmap.md`, sequencia por dependência, marca HITL/gates. Irmã macro da `plan-feature`. |
| `plan-feature` | [skills/plan-feature/SKILL.md](skills/plan-feature/SKILL.md) | Orquestrador de **entrada** (1 fatia): decompõe uma feature na cadeia `create-*`, marca passos aplicáveis + pontos human-in-the-loop + gates, e devolve o plano pro seu OK. Roda na sessão, não implementa. |
| `review-changes` | [skills/review-changes/SKILL.md](skills/review-changes/SKILL.md) | Umbrella de **saída**: lê o diff, roteia os arquivos pros revisores certos (fan-out em paralelo), consolida em 1 relatório por severidade + Fechamento. |
| `suggest-prs` | [skills/suggest-prs/SKILL.md](skills/suggest-prs/SKILL.md) | Fatia o trabalho não-mergeado em 1+ PRs (por preocupação, ordenados por dependência, branch sugerida) e escreve título + corpo (Conventional Commits + seções de markdown) de cada. Contraparte reativa do `plan-project`. Só o texto — não abre PR. |
| `suggest-commits` | [skills/suggest-commits/SKILL.md](skills/suggest-commits/SKILL.md) | Plano de commits atômicos (Conventional Commits) com o `git add` de cada um. Nunca commita. |
| `audit-vps` | [skills/audit-vps/SKILL.md](skills/audit-vps/SKILL.md) | Playbook read-only de auditoria da VPS de produção (SSH; SO/firewall/Docker/TLS/DB/backup). Par de geração do `infra-review`. Não altera estado. |

> A `create-page` força a decisão **local vs global** primeiro (estado só na tela aberta → hooks; entidade cross-app → redux-sagas), cruzando com os relacionamentos do `CLAUDE.md`. Na dúvida, ela pergunta. A `create-controller` faz o análogo: **forma mínima** (entidade folha) vs **completa** (escrita multi-tabela ou cruza ator).

### Cadeia completa de uma entidade nova

Ordem natural ao criar uma entidade do zero: `plan-feature` decompõe e roteia → **`create-model` → `create-migration` → `create-controller` → `create-route` → `create-page`**. Cada passo aponta pro revisor do par; no fim, `review-changes` faz o passe geral e `suggest-prs` + `suggest-commits` preparam a entrega.

Para um **épico** (várias entidades, multi-fatia), o macro-planner `plan-project` decompõe em fatias sobre o roadmap e chama `plan-feature` por fatia; o `state-audit` confere o estado antes e depois.

A skill de entrada (`plan-feature`) e a de saída (`review-changes`) são **orquestradores-como-skill**: rodam na sessão e usam a ferramenta Agent pra rotear. Subagente Claude é um nível só (não dispara outro subagente), então a orquestração mora na skill, não num agente `primary`.

---

## Governança

Camada incorporada do setup opencode de referência, **calibrada pra projeto solo** (sinal útil,
sem cerimônia de time grande). Vive em três lugares:

- **`.claude/context/governance.md`** — doc de governança. **Não é auto-carregado** (diferente do
  opencode, o Claude não lê a pasta `context/` sozinho): agentes e skills o citam **explicitamente**.
- **`.claude/settings.json`** — permissões `allow`/`deny` **+** `hooks`. As permissões: `deny` no
  destrutivo (`rm -rf`, `git reset --hard`, `git checkout --`, `git clean`, `git push --force`),
  `allow` no **read-only** (git de leitura: `status`/`diff`/`log`/`show`/`blame`/`ls-files`/…, e
  `npm test`/`build`). **Tudo que muta o estado** (commit, push, `db:migrate`) cai no `ask` padrão —
  pede permissão; read-only só notifica.
- **`.claude/hooks/`** — enforcement **determinístico** (roda fora do allow/deny): `guard-sensitive-writes.sh`
  (PreToolUse Edit/Write) força `ask` em `.env`/auth/models core/migration versionada; `typecheck-on-stop.sh`
  (Stop) roda `tsc` nos `// @ts-check` e segura o encerramento se quebrar; `format-on-stop.sh` (Stop) formata
  (`prettier --write`) e checa lint (`eslint` bloqueante, sem `--fix`) nos arquivos JS/JSX/CSS do turno. É o
  HITL virando barreira real.
- **`.claude/settings.local.json`** — override **local** (não versionado) que pode ampliar o `allow`.
  Mantenha estreito: comando que muta estado de produção (ex.: `ssh` à VPS) é HITL **por política** mesmo
  se o allow local liberar — não deixe o override furar a inspeção-primeiro do `audit-vps`.

**Níveis de autonomia** (detalhe em `governance.md`), mapeados aos nossos artefatos:

| Nível | Artefato |
|---|---|
| Observe (só aponta) | os reviewers read-only + `state-audit` |
| Advise (recomenda) | `suggest-commits`, `suggest-prs`, `plan-feature`, `plan-project` |
| Act with approval (gera sob revisão) | as skills `create-*` (inclui `create-test`, `add-ts-check`) |
| Autonomous bounded (mecânico, gate verde) | ajuste trivial sem item human-in-the-loop |

**Human-in-the-loop** — paro e confirmo antes de: migration destrutiva, auth/peso hierárquico,
exclusão de dados (hard delete/cascade), schema core, cutover de produção. Lista canônica em
`governance.md`; os gatilhos também estão no `CLAUDE.md` (sempre carregado) e o `guard-sensitive-writes`
hook os enforça no nível do harness.

**Fechamento (closing report)** — cada reviewer encerra com 1 linha (tipo + gaps); a umbrella
`review-changes` consolida o bloco completo (tipo de mudança · gates aplicáveis · gaps/riscos).

**Auto-update deste setup** — agentes/skills/contexto são ativos versionados e **não se auto-atualizam**.
Ao fechar algo validado: identifique o aprendizado reutilizável, classifique onde mora (agente, skill,
`governance.md` ou `CLAUDE.md`), proponha a mudança **mínima**, e nunca amplie `tools`/permissão nem
transforme caso pontual em regra global sem o meu ok. Reviewer jamais ganha `Edit`/`Write`.

---

## Como invocar

**Agentes:**
- **Natural** — só pedir ("revisa essa migration", "confere a auth dessa rota"); o agente é escolhido pelo `description`.
- **Explícito** — "usa o `migration-review` aqui".
- **`/agents`** — gerenciador interativo pra editar/testar/criar agentes sem mexer no `.md` na mão.

**Skills:**
- **`/create-migration <entidade>`** (ex.: `/create-route subject`) ou em linguagem natural. O argumento é o nome da entidade; sem ele, a skill pergunta.
- Skills são descobertas no **start da sessão**. Se não aparecerem como `/create-...`, um `/clear` ou nova sessão reindexa.

---

## Cheat sheet — usar / não usar (agentes)

### `migration-review`
- ✅ Escreveu/alterou migration e quer validar **antes** de `db:migrate` — pega o que quebra no MariaDB em produção.
- ❌ Escrever a migration (use a skill `create-migration`); migration trivial de 1 `addColumn`; debugar erro de migration em runtime.

### `db-schema-review`
- ✅ Alterou o schema (nova tabela/coluna/FK, ou auditar a modelagem) — pega FK lógica sem constraint real, índice faltando em FK, tipo/tamanho incoerente, collation mista, tabela órfã.
- ❌ Revisar a mecânica de aplicar a migration (use `migration-review`); o mapeamento ORM (use `model-review`).

### `model-review`
- ✅ Criou/alterou um model, ou quer auditar se o ORM reflete o schema — pega tabela sem model, association sem FK real, tipo/tamanho/default divergente do DDL.
- ❌ Design do schema (use `db-schema-review`); mecânica da migration (use `migration-review`).

### `controller-review`
- ✅ Criou/alterou um controller — confere a mecânica: transação + rollback no early-return, projeção whitelisted em todo retorno, soft delete via `status`, peso hierárquico quando cruza ator, `isValidId`, códigos HTTP, arrow methods.
- ❌ Revisar wiring de rota/flag (use `backend-auth-review`); checar coerência entre controllers (use `api-contract-review`); escrever a regra de negócio.

### `backend-auth-review`
- ✅ Adicionou/alterou rota ou ação de controller — confere o trio `loginRequired` → `roleAuth(flag)` → peso no controller, uso de `req.*` indefinido, e que não vazou campo nem deixou rota mutante aberta.
- ❌ Escrever a regra de negócio; decidir *qual* flag uma feature nova deveria ter (decisão de design); testar o fluxo rodando a API.

### `api-contract-review`
- ✅ Novo endpoint, ou mexeu em vários controllers / no `validateRequest` — garante que todos respondem no mesmo formato (`{errors}` plural, envelope de paginação canônico, status HTTP, projeção).
- ❌ Revisar um controller isolado pela mecânica interna (use `controller-review`); revisar autorização (use `backend-auth-review`).

### `ui-kit-review`
- ✅ Criou/alterou página em `pages/` — garante fachada `styled.js` + reuso do `components/ui` (principalmente pegar primitivo duplicado).
- ❌ Construir o componente do zero (use a skill `create-page`); revisar lógica React/Redux ou acessibilidade (fora de escopo de propósito).

### `infra-review`
- ✅ Criou/alterou IaC (compose, Dockerfile, Caddyfile, `.env.example`) ou vai preparar o cutover — pega segredo no arquivo, porta exposta além da borda, DB root, container root, rede não segmentada, TLS/headers.
- ❌ Auditar a VPS rodando (use a skill `audit-vps`); revisar código de aplicação (controller/rota/model/página).

### `state-audit`
- ✅ Quer saber "onde estamos" vs o `docs/roadmap.md` antes de planejar um épico ou após fechar uma fatia — reporta status por domínio + drift por fase.
- ❌ Planejar o próximo passo (use `plan-project`); corrigir o que achou (volte à sessão do domínio).

> **Fluxo natural:** a skill gera na sessão do domínio; no fim, dispara-se o agente revisor pra um passe limpo em contexto isolado. O agente **aponta**; você decide e corrige.

---

## Quando NÃO usar agente (geral)

- **Escrever** a migration/rota/componente em si — é trabalho de skill + contexto da conversa, que o agente isolado não tem.
- **Debug em runtime** — agente não roda a API nem o dev server pra ver o erro acontecer.
- **Lookup de 1 fato** que sai em 2 greps — disparar agente é overhead.
- Tarefa que **depende de muito do que foi falado** na sessão — o agente começa do zero.

---

## Como tunar

- **`model`** (agentes): atribuído por **stakes × profundidade de raciocínio** — `opus` onde um miss custa caro (segurança, dados, deploy) ou exige síntese; `sonnet` em review delimitado/comparação. **Tunável e validado rodando** (se o sonnet começar a deixar passar, sobe pra opus); `inherit` usa o modelo da sessão.

  | Agente | Modelo | Por quê |
  |---|---|---|
  | `backend-auth-review` | opus | authz; miss = escalonamento de privilégio |
  | `controller-review` | opus | rollback/atomicidade; raciocínio de control-flow |
  | `migration-review` | opus | quebra de deploy MariaDB (alto risco) |
  | `db-schema-review` | opus | integridade/modelagem de dados; raciocínio de schema |
  | `model-review` | opus | model↔DDL; miss = drift silencioso ORM/schema |
  | `infra-review` | opus | segurança de prod/cutover |
  | `state-audit` | opus | síntese cross-domínio + drift vs roadmap |
  | `api-contract-review` | sonnet | comparação de consistência entre endpoints (delimitado) |
  | `ui-kit-review` | sonnet | aderência de convenção (mecânico) |
  | `security-perf-review` *(F4)* | opus | segurança + varredura ampla |
- **`tools`** (agentes): manter `Read, Grep, Glob` nos revisores. **Não** adicionar `Edit`/`Write` — perde o ponto de controle.
- **`description`** (agentes e skills): é o que decide o roteamento automático e, na skill, a invocação por `/nome`. Se o item certo não for escolhido sozinho, refine o `description` (oriente a "quando usar").

---

## Como criar um novo agente

Arquivo `.md` em `.claude/agents/` (projeto, versiona) ou `~/.claude/agents/` (global, só sua máquina). Template:

```markdown
---
name: nome-kebab-case
description: O que faz e QUANDO usar (decide o roteamento automático).
tools: Read, Grep, Glob
model: opus
---

Instruções do papel: baseline real do projeto (caminhos, padrões),
checklist do que verificar, e formato de saída esperado.
```

Boas práticas:
1. **Aterrar no código real** — citar arquivos/padrões concretos, não instrução genérica.
2. **Restringir `tools`** ao mínimo — define segurança e foco.
3. **Definir formato de saída** — lista por severidade, com `arquivo:linha`.
4. **`description` orientado a gatilho** — "Use quando…".

---

## Como criar uma nova skill

Pasta `.claude/skills/<nome>/` com um `SKILL.md`. Template:

```markdown
---
name: nome-kebab-case
description: O que gera e QUANDO usar (decide roteamento + invocação por /nome).
---

# Título

Argumento esperado: <nome da entidade>. Sem argumento, perguntar antes de gerar.

Passos numerados, template de código aterrado no arquivo-base real,
e a lista de convenções obrigatórias do projeto.
```

Boas práticas:
1. **Aterrar num arquivo-base real** — a skill referencia o esqueleto canônico (ex.: `userRoutes.js` p/ rota).
2. **Aceitar argumento** (nome da entidade) e **perguntar** se não vier.
3. **Terminar apontando pro agente revisor** do par (fecha o ciclo fazer → checar) — ou pro hook, quando o "checar" é determinístico (`add-ts-check` → `typecheck-on-stop`).
4. **Arquivos de apoio**: a pasta da skill pode conter scripts/referências lidos sob demanda — não precisa caber tudo no `SKILL.md`.
