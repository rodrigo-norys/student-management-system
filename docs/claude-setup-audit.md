# Auditoria do setup `.claude/` — Student Management System

> **Propósito.** Auditar a estrutura `.claude/` do projeto (o que existe, o que dá para melhorar, o que falta) contra a documentação **oficial da Anthropic** e o framework **AI Fluency (4Ds)**, calibrada pela regra de escopo solo/portfólio do `roadmap.md §5`.
>
> **Data:** 2026-07-10. **Natureza:** read-only — diagnóstico + proposta, nada implementado.
>
> **Complementar, não substitui.** Este doc **não** substitui o [`roadmap.md`](roadmap.md): o roadmap é o artefato-âncora (o "onde estamos / o que falta" do produto e do tooling, §1.7/§4/§5). Aqui o recorte é diferente — benchmarking do setup de IA contra a doc oficial. Onde o roadmap declara e o disco diverge, o §2 reporta o drift; a fonte de verdade do estado é sempre o disco.
>
> **Regra de filtragem (roadmap §5):** projeto **solo / portfólio**, níveis Observe/Advise/Act-with-approval, sem inflar tooling. Recomendação só entra se **pagar o custo aqui**; padrão de mercado que não cabe na escala solo aparece etiquetado `[descartar-por-cerimônia]`, não omitido.

---

## §1. Inventário do `.claude/` (lido do disco em 2026-07-10)

Contagem **lida do disco**, não do que o roadmap declara. Total versionado: **28 arquivos** sob `.claude/` (o `settings.local.json` é gitignored).

### 1.1 Agentes — `.claude/agents/` — **9 no disco**

Todos `tools: Read, Grep, Glob` (read-only, nível Observe). Modelo por stakes.

| Agente | Arquivo | Modelo | Papel | Estado |
|---|---|---|---|---|
| `migration-review` | `agents/migration-review.md` | opus | Migration nova antes do `db:migrate` (compat MariaDB 10.11, ESM, reversibilidade do `down`, apply parcial) | ativo |
| `db-schema-review` | `agents/db-schema-review.md` | opus | Design de dados (integridade referencial, índices, tipos, normalização, collation) | ativo |
| `model-review` | `agents/model-review.md` | opus | Fidelidade ORM↔schema (registro em `database/index.js`, associations↔FK, tipos/defaults) | ativo |
| `controller-review` | `agents/controller-review.md` | opus | Mecânica do controller (transação/rollback, projeção whitelisted, soft delete, peso, `isValidId`, HTTP) | ativo |
| `backend-auth-review` | `agents/backend-auth-review.md` | opus | Rota/controller: `loginRequired`→`roleAuth(flag)`→peso; `req.*` indefinido | ativo |
| `api-contract-review` | `agents/api-contract-review.md` | **sonnet** | Coerência de contrato entre endpoints (`{errors}`, envelope de paginação, status, shape) | ativo |
| `ui-kit-review` | `agents/ui-kit-review.md` | **sonnet** | Fachada `styled.js` + reuso de `components/ui`, casing de pasta | ativo |
| `infra-review` | `agents/infra-review.md` | opus | IaC do repo (segredo fora do arquivo, porta na borda, DB least-privilege, rede segmentada, TLS) | ativo |
| `state-audit` | `agents/state-audit.md` | opus | Macro: re-roda o diagnóstico por domínio e compara com `docs/roadmap.md` (drift/progresso) | ativo |

`security-perf-review` (F4) é **planejado** — **não existe arquivo no disco**. Alvo declarado: 10 agentes.

### 1.2 Skills — `.claude/skills/<nome>/SKILL.md` — **13 no disco**

Frontmatter só com `name` + `description` (sem `tools`/`model` — herdam a sessão; rodam no contexto atual, nível Act-with-approval ou Advise).

| Skill | Arquivo | Nível | O que faz |
|---|---|---|---|
| `create-model` | `skills/create-model/SKILL.md` | Act-w/approval | Model Sequelize ESM + registro em `database/index.js` |
| `create-migration` | `skills/create-migration/SKILL.md` | Act-w/approval | Migration ESM (`up`/`down`), padrão `createTable` |
| `create-controller` | `skills/create-controller/SKILL.md` | Act-w/approval | Controller CRUD canônico (decide mínima vs completa) |
| `create-route` | `skills/create-route/SKILL.md` | Act-w/approval | Rota Express (`loginRequired`/`roleAuth(flag)`, registro em `app.js`) |
| `create-page` | `skills/create-page/SKILL.md` | Act-w/approval | Página React (decide LOCAL vs GLOBAL antes de gerar) |
| `create-test` | `skills/create-test/SKILL.md` | Act-w/approval | Testes vitest+supertest contra `school_test` |
| `add-ts-check` | `skills/add-ts-check/SKILL.md` | Act-w/approval | Adota `// @ts-check` opt-in + JSDoc (verificado pelo hook) |
| `plan-feature` | `skills/plan-feature/SKILL.md` | Advise | Decompõe 1 fatia na cadeia canônica; marca HITL/gates |
| `plan-project` | `skills/plan-project/SKILL.md` | Advise | Macro-planner de épico/fase sobre `docs/roadmap.md` |
| `review-changes` | `skills/review-changes/SKILL.md` | Advise | Umbrella: lê o diff, roteia aos revisores, consolida |
| `suggest-commits` | `skills/suggest-commits/SKILL.md` | Advise | Plano de commits atômicos (Conventional Commits) |
| `suggest-prs` | `skills/suggest-prs/SKILL.md` | Advise | Fatia a pilha em 1+ PRs + escreve título/corpo |
| `audit-vps` | `skills/audit-vps/SKILL.md` | Observe/Advise | Playbook read-only de auditoria da VPS de produção |

### 1.3 Hooks — `.claude/hooks/` — **3 no disco** (cabeados no `settings.json`)

| Hook | Arquivo | Evento (`settings.json`) | Papel | Estado |
|---|---|---|---|---|
| `guard-sensitive-writes` | `hooks/guard-sensitive-writes.sh` | PreToolUse `Edit\|Write` | Força `permissionDecision:"ask"` em `.env` (menos `.env.example`), auth (`loginRequired`/`roleAuth`), models core, migration já versionada | ativo |
| `typecheck-on-stop` | `hooks/typecheck-on-stop.sh` | Stop | `tsc --noEmit` sobre arquivos `// @ts-check`; `decision:"block"` se quebra. Fail-open + loop-guard | ativo |
| `format-on-stop` | `hooks/format-on-stop.sh` | Stop | Prettier `--write` nos arquivos do turno **+ ESLint check-and-block** (sem `--fix`) em `backend/src`. Fail-open + loop-guard | ativo — **não documentado na governança (ver §2)** |

### 1.4 Context — `.claude/context/`

| Arquivo | Papel | Estado |
|---|---|---|
| `context/governance.md` | Níveis de autonomia, lista HITL, gates reais, hooks, fechamento, "conteúdo externo é não-confiável", atualização controlada. **Não auto-carregado** — citado explicitamente | ativo; §Hooks lista só 2 dos 3 hooks (§2) |
| `agents-guide.md` (raiz de `.claude/`) | Guia de consulta: agente≠sessão, matriz fazer→checar, tabela de agentes/skills, como tunar/criar | ativo; §Hooks lista só 2 dos 3 hooks (§2) |

### 1.5 Settings / permissões

| Arquivo | Conteúdo | Estado |
|---|---|---|
| `settings.json` | `permissions.allow` (git read-only + `npm test`/`build`), `permissions.deny` (`rm -rf`, `git reset --hard`, `git checkout --`, `git clean`, `git push --force`), `hooks` (os 3 acima). **Sem `defaultMode`** (usa "Manual") | versionado |
| `settings.local.json` | `allow` local: `ssh sms-vps <subcomando read-only>` (docker ps/inspect/info/version/images/network ls/system df, ss, df, free, uptime, uname, timedatectl, getent, ufw status, nft list, systemctl is-active/is-enabled, sshd -T) + `docker buildx *`, `docker manifest *`, `git checkout *`, `git -C … diff --stat` | **gitignored** (não versionado) |

### 1.6 Primitivos oficiais **ausentes** no projeto (confirmado no disco)

`.claude/commands/` · `.claude/rules/` · `.claude/output-styles/` · `.mcp.json` (nenhum, em lugar nenhum) · `CLAUDE.local.md`. Avaliados no §3/§4.

---

## §2. Drift — o que o roadmap declara vs. o disco

### D1 — **Terceiro hook (`format-on-stop`) não refletido na governança escrita** 🟠

O disco tem **3 hooks**; a governança escrita descreve **2**:
- `roadmap.md §1.7` (linha ~79 e ~230) nomeia só `guard-sensitive-writes` e `typecheck-on-stop`. A matriz `§4` não lista hooks individualmente ("13 skills + hooks de governança").
- `agents-guide.md §Skill vs Agente` (bloco "Hooks") e `governance.md §Hooks` também descrevem **apenas** esses 2.

O `format-on-stop.sh` está **cabeado e ativo** no `settings.json` (evento Stop) e roda um **gate determinístico real**: ESLint como *check-and-block* em `backend/src`, que **segura o encerramento do turno** se acusar erro. Ou seja: existe uma terceira barreira determinística (lint) que a governança não menciona. Além disso, `governance.md §Gates reais` diz que o gate de frontend é `CI=true npm run build` / `vite build` — mas o `format-on-stop` já executa ESLint no backend a cada Stop, um gate ausente daquela tabela.

**Natureza:** doc-drift (a governança ficou atrás do disco). Consistente com a memória de projeto "baseline formatação/lint" (automação em 3 camadas), então é **intencional mas subdocumentado** — não é hook órfão.

### D2 — Contagem de agentes/skills: **sem drift** ✅

Disco = **9 agentes / 13 skills**, batendo exatamente com `roadmap §1.7`, `§4` (tabelas de 9 + 13) e `agents-guide.md` ("9 ativos"). O antigo doc-drift "5 reviewers" já foi corrigido (roadmap linha ~223). Modelos por agente também batem com a tabela de `agents-guide.md §Como tunar` (opus em 7, sonnet em `api-contract-review` e `ui-kit-review`). Registro este eixo explicitamente porque a instrução manda **contar do disco** — e aqui a contagem confirma o roadmap.

### D3 — `settings.local.json`: "estreitado para read-only" é **parcialmente** verdade 🟡

`roadmap §4` (linha ~443) diz que o `settings.local.json` "já teve o `ssh` estreitado para read-only". **Confirmado** para os comandos `ssh sms-vps …`: todos são inspeção (nenhum muta a VPS). Mas o mesmo `allow` local carrega **3 comandos locais não-read-only** fora do escopo ssh: `docker buildx *`, `docker manifest *` e **`git checkout *`**. O `git checkout *` é o ponto sensível: `git checkout <arquivo>` **descarta o working tree** do arquivo e **não** casa com o `deny` do `settings.json` (`git checkout --:*` cobre só a forma com `--`). Resultado: uma operação destrutiva de arquivo passa sem prompt. `governance.md` (§Governança / linha ~52) já prevê ampliação local como "exemplo aceitável", mas a própria regra manda "mantenha estreito" — e `git checkout *` é amplo. Ver recomendação R2.

### D4 — `security-perf-review` planejado ≠ presente (esperado, não é erro) ✅

`roadmap §4` e `agents-guide.md` marcam `security-perf-review` como **planejado (F4)**. Disco: ausente, como declarado. Sem drift — é backlog, registrado aqui só para fechar o inventário (alvo = 10 agentes).

---

## §3. Benchmark contra a doc oficial da Anthropic (AI Fluency 4Ds + primitivos)

### 3.1 O framework conceitual (AI Fluency) — mapeado, **não** confundido com os primitivos técnicos

AI Fluency (Anthropic + Profs. Rick Dakan/Ringling e Joseph Feller/UCC; CC BY-NC-SA 4.0): *"the ability to work with AI systems in ways that are effective, efficient, ethical, and safe"*, organizada em 4 competências interconectadas — Delegation, Description, Discernment, Diligence.
Fontes oficiais: Cheat Sheet https://www-cdn.anthropic.com/4396730ed190e691a3712cf2fd6bfe35509deca2.pdf · one-pager https://www-cdn.anthropic.com/334975cdec18f744b4fa511dc8518bd8d119d29d.pdf · curso https://anthropic.skilljar.com/ai-fluency-framework-foundations · https://www.anthropic.com/learn/claude-for-you

> Nota de diligência (pedida no escopo): os 4Ds são um **framework conceitual**; agents/skills/hooks são **primitivos técnicos**. Abaixo eu **mapeio** um no outro — o setup do projeto é uma *operacionalização* dos 4Ds nos primitivos —, sem tratá-los como a mesma coisa.

**Delegation** — *"deciding what work should be done by humans, what by AI, and how to distribute tasks"* (Cheat Sheet; lição https://www.anthropic.com/ai-fluency/ai-fluency-delegation).
- **Onde o setup adere:** o par **fazer→checar** (skill gera / agente read-only revisa) é *Task Delegation* institucionalizada. Os **níveis de autonomia** (Observe/Advise/Act-with-approval) e a **lista HITL** decidem explicitamente o que fica com o humano. `plan-feature`/`plan-project` são *Problem Awareness* (entender o objetivo antes de envolver a IA). O **modelo por stakes** (opus onde um miss custa caro; sonnet no delimitado — `agents-guide.md §Como tunar`) é *Platform Awareness* aplicada.
- **Ressalva honesta:** os "4 níveis de autonomia" são **convenção do projeto** (herdada do setup opencode, `governance.md`), **não** uma taxonomia oficial da Anthropic. A doc de Claude Code **não** usa "níveis 1–4"; usa *"reversibility determines autonomy"* + permission modes (https://code.claude.com/docs/en/best-practices.md, https://code.claude.com/docs/en/permission-modes.md). A boa notícia: os níveis do projeto **mapeiam limpo** nesse princípio oficial (read-only/reversível → autônomo; muta estado/produção → aprovação).

**Description** — *"effectively communicating with AI systems… clearly defining outputs, guiding AI processes, and specifying desired behaviors"* (Cheat Sheet; lição https://www.anthropic.com/ai-fluency/description). Subcomponentes: Product / Process / Performance.
- **Onde adere:** skills **aterradas em arquivo-base real** (`create-*` referenciam `UserController.js`, `userRoutes.js` etc.) são *Process Description* (o passo-a-passo que a IA segue). O `CLAUDE.md` de projeto (convenções) é *Product Description*. O `CLAUDE.md` **do usuário** (tom sênior, pt-br, "seja direto") é literalmente *Performance Description* — *"whether it should be concise or detailed, challenging or supportive"*. `description` orientado a gatilho ("Use quando…") é o que faz o roteamento automático funcionar.

**Discernment** — *"thoughtfully and critically evaluating AI outputs, processes, behaviors"* (Cheat Sheet; Product/Process/Performance). É o **D mais forte** deste setup.
- **Onde adere:** os **9 reviewers read-only** são *Product Discernment* sistematizado (avaliar qualidade/adequação do que a IA produziu). `review-changes` + o **Fechamento (closing report)** tornam o discernimento um passo obrigatório, não ad-hoc. `state-audit` é *Process/Performance Discernment* no nível de projeto (o resultado ainda bate com o plano?). O paralelismo oficial **Description↔Discernment** (mesmos eixos product/process/performance; Description-Discernment Loop, https://www.anthropic.com/ai-fluency/description-discernment-loop) aparece de fato no par skill(descreve/gera)↔agente(discerne).
- **Ponto fino, alinhado:** os reviewers são a IA checando a IA — mas o setup **preserva o discernimento humano final** ("o agente aponta; você decide e corrige", `agents-guide.md`). Isso é o correto: Discernment continua sendo do humano; os agentes o *amplificam*, não o *substituem*.

**Diligence** — *"using AI responsibly and ethically… transparency, and taking accountability for AI-assisted work"* (Cheat Sheet). Subcomponentes: Creation / Transparency / Deployment.
- **Onde adere:** os **gates HITL** (auth/peso, schema core, exclusão de dados, cutover de produção) e o hook `guard-sensitive-writes` são *Deployment Diligence* virando **barreira determinística** — "verificar e responder pelo output antes de usá-lo/compartilhá-lo". `governance.md §Conteúdo externo é não-confiável` é uma prática explícita de Diligence (MCP/WebFetch = dados, não instrução). `§Atualização controlada` (ativos versionados, "nunca ampliar tools/permissão sem meu ok", "reviewer nunca ganha Edit/Write") é Diligence sobre o **próprio setup**.
- **Onde é fino (baixo risco solo):** *Transparency Diligence* ("ser honesto sobre o papel da IA com quem precisa saber") não é formalizada — a convenção de commits do dono não marca autoria de IA. Para **solo/portfólio**, "quem precisa saber" é o próprio dono → risco baixo. Fica como observação, não pendência (ver R-descartada).

### 3.2 Os primitivos técnicos — cada dimensão contra a doc oficial

| Primitivo | Doc oficial | Como o setup usa | Veredito |
|---|---|---|---|
| **Subagents** | https://code.claude.com/docs/en/sub-agents.md | `.claude/agents/*.md`, `tools` restrito a `Read,Grep,Glob`, `model` por stakes, `description` "when to use". É exatamente o padrão oficial "code-reviewer" com tool-restriction | **Adere plenamente.** A restrição de tools + "reviewer nunca ganha Edit/Write" é o ponto de controle recomendado |
| **Skills** | https://code.claude.com/docs/en/skills.md | `.claude/skills/<n>/SKILL.md`, progressive disclosure (só name+description no contexto até invocar), invocação por `/nome` + model-invoked, aterradas em arquivo-base | **Adere.** O `agents-guide.md §As skills` descreve progressive disclosure corretamente |
| **Hooks** | https://code.claude.com/docs/en/hooks.md | PreToolUse (`ask`) + Stop (`block`), contrato JSON, fail-open + loop-guard (`stop_hook_active`). Determinístico, fora do allow/deny | **Adere plenamente.** Uso correto de `permissionDecision`/`decision:"block"`. Só falta **documentar** o 3º hook (§2/D1) |
| **Memory / CLAUDE.md** | https://code.claude.com/docs/en/memory.md | CLAUDE.md projeto + user; auto-memory (`MEMORY.md`); `governance.md`/`agents-guide.md` **citados à mão** (não auto-carregados) | **Adere**, com oportunidade: o padrão "citar à mão" reinventa o que `.claude/rules/` (frontmatter `paths`, auto-load condicional) faz nativo — ver §4/§3.3 |
| **Settings / permissões** | https://code.claude.com/docs/en/permission-modes.md | `allow` read-only / `deny` destrutivo / `ask` default; override local estreito. Mapeia o princípio oficial *"reversibility determines autonomy"* | **Adere.** Um ajuste de higiene em `git checkout *` (§2/D3, R2) |
| **MCP** | https://code.claude.com/docs/en/mcp.md | Nenhum `.mcp.json` no projeto. Reviewers leem DDL/migrations estáticos, não o banco live | **Ausência deliberada e correta** para solo — ver §4 |
| **Output styles** | https://code.claude.com/docs/en/output-styles.md | Nenhum. Persona (pt-br/sênior) já vive no `CLAUDE.md` do usuário | **Ausência ok** (redundante com CLAUDE.md) |
| **Slash commands** | https://code.claude.com/docs/en/slash-commands.md | Usa `.claude/skills/` (formato moderno), **não** o legado `.claude/commands/` | **Aderente à recomendação oficial** (skills é o formato preferido). Sem gap |
| **Plugins** | https://code.claude.com/docs/en/plugins.md | Nenhum. Todo o `.claude/` é um bundle coeso que *poderia* virar plugin | **Ausência ok** para solo — caveat portfólio no §5 |

> Incertezas sinalizadas (diligência): (a) detalhes version-specific da doc de subagents/hooks (ex.: default de background, campo `effort`) não foram fixados a uma versão — não dependo deles em nenhuma recomendação. (b) O recurso `.claude/rules/` com `paths` é apresentado como oficial em `memory.md`; recomendo-o como **avaliar**, não como certeza de que paga o custo. (c) "co-creation" **não** é rótulo oficial do AI Fluency — o construto equivalente é **Augmentation ("thinking partners")** + o Description-Discernment Loop; não usei "co-creation" como termo canônico.

---

## §4. Análise por dimensão — Já tem / Melhorar / Falta

### Delegação / autonomia
- **Já tem:** 4 níveis mapeados a artefatos reais; par fazer→checar; lista HITL canônica em 3 lugares (CLAUDE.md gatilhos + governance.md + hook); decomposição antes de agir (`plan-*`).
- **Melhorar:** ancorar explicitamente a taxonomia de níveis no princípio oficial *reversibility* (é o mesmo espírito, dá lastro à convenção). Documentar `format-on-stop` como 3ª barreira determinística.
- **Falta:** nada crítico. O nível "Autonomous bounded" é quase teórico num setup read-only-first — ok deixá-lo como está.

### Permissões
- **Já tem:** `allow` read-only, `deny` destrutivo, `ask` default; local estreito para ssh de inspeção; `.git`/`.claude` já protegidos nativamente pelo harness.
- **Melhorar:** `git checkout *` no `settings.local.json` é amplo demais (escapa do `deny git checkout --`; descarta working tree sem prompt) → estreitar ou remover (R2). Opcional: declarar `permissions.defaultMode` explícito no `settings.json` (hoje implícito "Manual").
- **Falta:** nada.

### Agentes
- **Já tem:** 9 read-only, tools mínimos, model por stakes, `description` por gatilho, divisão sem sobreposição (trio backend rota/mecânica/contrato; trio dados migration/schema/model).
- **Melhorar:** nada estrutural — a disciplina "reviewer nunca ganha Edit/Write" está correta e é o ativo mais valioso.
- **Falta:** `security-perf-review` (F4, já planejado) — fecha o último par transversal.

### Skills
- **Já tem:** 13, progressive disclosure, aterradas em arquivo-base, terminam apontando pro revisor do par, decidem forma (local/global, mínima/completa) antes de gerar.
- **Melhorar:** nada necessário. (Opcional teórico: `argument-hint`/`disable-model-invocation` no frontmatter — mas as `create-*` **ganham** com model-invocation; não mexer.)
- **Falta:** nada.

### Hooks
- **Já tem:** 3 hooks com contrato correto, fail-open e loop-guard. Cobrem escrita sensível (PreToolUse) + tipos + format/lint (Stop).
- **Melhorar:** **documentar** o `format-on-stop` (governance.md §Hooks + §Gates reais, agents-guide.md, roadmap §1.7/§4) — é o drift D1.
- **Falta:** nada. (Um `SessionStart` para lembrar de ativar o pre-commit `.githooks` por clone seria conveniência, mas é cerimônia — descartar.)

### Context / memory
- **Já tem:** CLAUDE.md projeto + user; auto-memory ativa (`MEMORY.md`, ~19 entradas); governance/agents-guide citados à mão; separação clara "sempre carregado (CLAUDE.md) vs sob demanda (skills)".
- **Melhorar:** avaliar migrar regras **por-domínio** hoje embutidas no CLAUDE.md/governance.md para `.claude/rules/` com `paths` (auto-load só quando o Claude toca arquivos que casam) — reduz o que fica sempre no contexto e entrega a regra certa na hora certa. Oficial, mas custo médio (ver R6).
- **Falta:** nada crítico.

### Primitivos ausentes (avaliados)
- **`.claude/rules/`** — candidato **real** de melhoria (§R6). Único ausente que talvez pague o custo solo.
- **MCP / Output styles / Plugins / commands legado** — ausências **corretas** para a escala solo (detalhe no §5).

---

## §5. Recomendações priorizadas (impacto × esforço) — proposta, não obrigação

Todas filtradas pela regra solo/portfólio do `roadmap §5`. Ordem: maior impacto / menor esforço primeiro.

| # | Recomendação | Etiqueta | Impacto × Esforço | Por que paga o custo **aqui** |
|---|---|---|---|---|
| **R1** | **Documentar o `format-on-stop` como 3º hook/gate** em `governance.md §Hooks`+§Gates reais, `agents-guide.md` e `roadmap §1.7/§4` | `[melhorar]` | médio × trivial | Corrige o drift D1: existe uma barreira de lint que **bloqueia o encerramento** e a governança não a descreve. Governança fiel ao disco é o mínimo de um setup que se leva a sério (Diligence sobre o próprio tooling) |
| **R2** | **Estreitar `git checkout *`** no `settings.local.json` (para a forma usada — troca de branch — ou remover) | `[melhorar]` | médio × trivial | D3: hoje `git checkout <arquivo>` descarta working tree **sem prompt**, furando o espírito do `deny` destrutivo. Higiene de permissão barata |
| **R3** | **Manter** os 9 reviewers read-only, tools mínimos, model por stakes, "nunca Edit/Write" | `[manter]` | alto × zero | É o ponto de controle que faz o Discernment funcionar. Não mexer é a decisão certa |
| **R4** | **Manter** o par fazer→checar + 4 níveis + lista HITL | `[manter]` | alto × zero | Delegation+Diligence já operacionalizados e calibrados p/ solo (`roadmap §5`) |
| **R5** | **Adicionar `security-perf-review` (F4)** quando o hardening começar | `[adicionar]` | médio × baixo | Já no plano; fecha o par transversal de segurança (rate-limit, bcrypt, upload, N+1, deps). Nasce junto do trabalho que ele revisa — custo marginal, e cobre exatamente os furos do `roadmap §1.6` |
| **R6** | **Avaliar `.claude/rules/`** (frontmatter `paths`) para regras por-domínio hoje no CLAUDE.md/governance.md — ex.: regra de migration só ao tocar `database/migrations/**` | `[melhorar]` | médio × médio | Recurso **oficial** (memory.md) que substitui o "citar à mão" por auto-load condicional; enxuga o contexto sempre-carregado. **Avaliar, não obrigar** — o padrão atual funciona; só entra se o CLAUDE.md/governance crescer a ponto de doer |
| **R7** | MCP de banco (`.mcp.json` read-only MariaDB) | `[descartar-por-cerimônia]` | — | Os reviewers de dados são **estáticos por design** (leem DDL/migrations, não o banco live) e isso é uma força, não gap. Sem dor real de copy-paste. Só reconsiderar se surgir necessidade recorrente de schema live |
| **R8** | Empacotar o `.claude/` como **plugin** distribuível | `[descartar-por-cerimônia]` | — | Plugin é para **distribuir/versionar entre pessoas** — cerimônia para solo. **Caveat portfólio:** se a vitrine for o objetivo, o empacotamento em si demonstraria domínio dos primitivos; então é "descartado por cerimônia operacional, reconsiderável como artefato de portfólio" |
| **R9** | **Output style** pt-br/persona | `[descartar-por-cerimônia]` | — | Redundante: persona e idioma já vivem no `CLAUDE.md` do usuário (que é Performance Description). Um output style duplicaria a fonte |
| **R10** | **Transparency Diligence** formal (marcar papel da IA em cada commit/PR) | `[descartar-por-cerimônia]` | — | Para solo/portfólio, "quem precisa saber" é o próprio dono → disclosure formal é cerimônia. A convenção de commits do dono já basta. (Reconsiderar só se o projeto virar multi-pessoa) |

---

### Fecho

O setup é **maduro e bem-calibrado para solo**: adere aos primitivos oficiais (subagents com tool-restriction, skills com progressive disclosure, hooks determinísticos, permissões por reversibilidade) e operacionaliza os 4Ds do AI Fluency com clareza — **Discernment** (os 9 reviewers) e **Diligence** (gates HITL + hook + governança) são os eixos mais fortes. As pendências reais são **pequenas e de higiene**: um hook subdocumentado (R1), uma permissão local ampla demais (R2) e um recurso oficial a avaliar (`.claude/rules/`, R6). Nada aqui pede inflar o tooling — as recomendações de "adicionar" se limitam a um agente já planejado (R5); todo padrão de mercado que não cabe na escala solo saiu etiquetado, não omitido.

> Gerado read-only em 2026-07-10. Complementa `roadmap.md` (§1.7/§4/§5); não o substitui. Nada implementado.
