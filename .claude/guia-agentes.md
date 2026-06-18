# Guia de Agentes e Skills — Student Management System

Referência de consulta sobre os subagents e skills do projeto: o que são, quando usar, quando **não** usar, e como ajustar/criar.

---

## Conceito: agente ≠ sessão

Separar trabalho em **sessões** (ex.: student backend, student frontend, dúvidas gerais) mantém o **contexto da conversa** limpo por domínio.

Um **agente** faz algo relacionado mas diferente: roda uma tarefa em **contexto isolado e devolve só a conclusão** — de dentro de qualquer sessão, sem sujar o contexto dela.

Exemplo: na sessão "student backend", ao revisar uma migration nova, em vez de carregar as ~47 migrations no contexto compartilhado, dispara-se um agente que lê tudo, valida e devolve só "ok" ou "linha 33 quebra no MariaDB". O trabalho sujo fica no contexto **dele**.

> Agente **complementa** a separação de sessões, não substitui.

---

## Skill vs Agente — fazer vs checar

São ferramentas complementares:

- **Skill** roda no **contexto atual** — injeta procedimento/conhecimento e eu executo aqui. É o **fazer**.
- **Agente** roda em **contexto isolado** — devolve só a conclusão. É o **checar**.

No projeto eles vêm em pares **fazer → checar**, organizados em três camadas:

**Camada 1 — Geração + revisão especializada (pares 1:1):**

| Domínio | Skill (fazer) | Agente (checar) |
|---------|---------------|-----------------|
| Model | `criar-model` | — (validado via controller/migration) |
| Migration | `criar-migration` | `migration-review` |
| Controller | `criar-controller` | `controller-review` |
| Rota | `criar-rota` | `backend-auth-review` |
| Página | `criar-pagina` | `ui-kit-review` |

**Camada 2 — Governança transversal (não casa 1:1 com um arquivo):**

| Preocupação | Agente / Skill |
|---|---|
| Coerência do contrato HTTP entre endpoints | `api-contract-review` (agente) |
| Passe de review completo do diff | `revisar-mudancas` (skill, umbrella) |

**Camada 3 — Processo:** `sugerir-commits` (plano de commits), `descrever-pr` (descrição de PR). Não revisam código — preparam a entrega.

Fluxo: a skill gera seguindo o padrão; o agente revisa em contexto limpo; a umbrella `revisar-mudancas` orquestra os revisores certos sobre o diff antes do PR.

---

## Os agentes do projeto

Todos são **read-only** (`tools: Read, Grep, Glob`) e estão em `model: opus`. Um revisor com `Write` viraria editor disfarçado e tiraria o ponto de controle.

| Agente | Arquivo | Função |
|--------|---------|--------|
| `migration-review` | [agents/migration-review.md](agents/migration-review.md) | Revisa migration nova antes do `db:migrate`: compat MariaDB 10.11, formato ESM, reversibilidade do `down`, aplicação parcial, duplicata transitória em índice único. |
| `controller-review` | [agents/controller-review.md](agents/controller-review.md) | Revisa a **mecânica** de um controller: integridade transacional + rollback, projeção whitelisted, soft delete via `status`, peso hierárquico, `isValidId`, códigos HTTP, arrow methods. |
| `backend-auth-review` | [agents/backend-auth-review.md](agents/backend-auth-review.md) | Revisa rota/controller: `loginRequired` → `roleAuth(flag)` → peso hierárquico no controller, `status` ENUM, projeção whitelisted. |
| `api-contract-review` | [agents/api-contract-review.md](agents/api-contract-review.md) | **Transversal**: coerência do contrato entre endpoints — envelope de erro `{errors}` plural, envelope de paginação canônico, status HTTP, shape de resposta. Compara o alvo com os irmãos. |
| `ui-kit-review` | [agents/ui-kit-review.md](agents/ui-kit-review.md) | Revisa página/componente: fachada `styled.js` reexportando `components/ui`, casing de pasta, sem duplicar primitivo do UI Kit. |

> **Divisão dos três revisores de backend** (evita sobreposição): `backend-auth-review` = camada de **rota** (login/flag/peso existe?); `controller-review` = **mecânica interna** de um arquivo (transação, projeção, soft delete); `api-contract-review` = **consistência entre** arquivos (todos respondem igual?).

---

## As skills do projeto

Skills moram em `.claude/skills/<nome>/SKILL.md` e carregam por **progressive disclosure**: só `name` + `description` ficam no contexto até a skill ser invocada (≠ `CLAUDE.md`, sempre carregado). Cada uma foi aterrada num arquivo-base real e termina apontando pro agente revisor do par.

| Skill | Arquivo | Base | O que gera |
|-------|---------|------|------------|
| `criar-model` | [skills/criar-model/SKILL.md](skills/criar-model/SKILL.md) | `Student.js` + `Address.js` | Model Sequelize ESM: `init`/`super.init`, colunas snake_case com `validate`+`msg`, `status` ENUM, FKs, `associate`, **registro em `database/index.js`**. |
| `criar-migration` | [skills/criar-migration/SKILL.md](skills/criar-migration/SKILL.md) | `create-staff.js` | Migration ESM (`up`/`down`): `id` → FKs com `references`+`onUpdate`/`onDelete` → texto com `STRING(n)` → `status` ENUM → timestamps. |
| `criar-controller` | [skills/criar-controller/SKILL.md](skills/criar-controller/SKILL.md) | `StudentController.js` + `UserController.js` | Controller CRUD: 5 actions, arrow methods, projeção whitelisted, transação, soft delete, peso hierárquico, `handleErrors`. **Decide forma mínima vs completa.** |
| `criar-rota` | [skills/criar-rota/SKILL.md](skills/criar-rota/SKILL.md) | `userRoutes.js` | Arquivo de rotas Express: `loginRequired`, `roleAuth(flag)`, ordem estática-antes-de-`/:id`, registro em `app.js`. |
| `criar-pagina` | [skills/criar-pagina/SKILL.md](skills/criar-pagina/SKILL.md) | User (local) + store do Student (global) | Página React; **decide local (hooks) vs global (redux-sagas) antes de gerar**. |

**Skills de processo/governança** (não geram entidade — orquestram e preparam a entrega):

| Skill | Arquivo | O que faz |
|-------|---------|-----------|
| `planejar-feature` | [skills/planejar-feature/SKILL.md](skills/planejar-feature/SKILL.md) | Orquestrador de **entrada**: decompõe uma feature na cadeia `criar-*`, marca passos aplicáveis + pontos human-in-the-loop + gates, e devolve o plano pro seu OK. Roda na sessão, não implementa. |
| `revisar-mudancas` | [skills/revisar-mudancas/SKILL.md](skills/revisar-mudancas/SKILL.md) | Umbrella de **saída**: lê o diff, roteia os arquivos pros revisores certos (fan-out em paralelo), consolida em 1 relatório por severidade + Fechamento. |
| `descrever-pr` | [skills/descrever-pr/SKILL.md](skills/descrever-pr/SKILL.md) | Gera a descrição do PR a partir do diff contra `main` (contexto/o que mudou/como testar/riscos/checklist). Só o texto — não abre PR. |
| `sugerir-commits` | [skills/sugerir-commits/SKILL.md](skills/sugerir-commits/SKILL.md) | Plano de commits atômicos (Conventional Commits) com o `git add` de cada um. Nunca commita. |

> A `criar-pagina` força a decisão **local vs global** primeiro (estado só na tela aberta → hooks; entidade cross-app → redux-sagas), cruzando com os relacionamentos do `CLAUDE.md`. Na dúvida, ela pergunta. A `criar-controller` faz o análogo: **forma mínima** (entidade folha) vs **completa** (escrita multi-tabela ou cruza ator).

### Cadeia completa de uma entidade nova

Ordem natural ao criar uma entidade do zero: `planejar-feature` decompõe e roteia → **`criar-model` → `criar-migration` → `criar-controller` → `criar-rota` → `criar-pagina`**. Cada passo aponta pro revisor do par; no fim, `revisar-mudancas` faz o passe geral e `descrever-pr` + `sugerir-commits` preparam a entrega.

A skill de entrada (`planejar-feature`) e a de saída (`revisar-mudancas`) são **orquestradores-como-skill**: rodam na sessão e usam a ferramenta Agent pra rotear. Subagente Claude é um nível só (não dispara outro subagente), então a orquestração mora na skill, não num agente `primary`.

---

## Governança

Camada incorporada do setup opencode de referência, **calibrada pra projeto solo** (sinal útil,
sem cerimônia de time grande). Vive em dois lugares novos:

- **`.claude/context/governanca.md`** — doc de governança. **Não é auto-carregado** (diferente do
  opencode, o Claude não lê a pasta `context/` sozinho): agentes e skills o citam **explicitamente**.
- **`.claude/settings.json`** — permissões `allow`/`deny`. A permissão do opencode (que lá ficava no
  frontmatter do agente) aqui se traduz em `tools:` (whitelist por agente) **+** regras de comando no
  settings: `deny` no destrutivo (`rm -rf`, `git reset --hard`, `git checkout --`, `git clean`,
  `git push --force`), `allow` no read-only (`git status/diff/log`, `npm test`). Resto cai no `ask` padrão.

**Níveis de autonomia** (detalhe em `governanca.md`), mapeados aos nossos artefatos:

| Nível | Artefato |
|---|---|
| Observe (só aponta) | os 5 reviewers read-only |
| Advise (recomenda) | `sugerir-commits`, `descrever-pr`, `planejar-feature` |
| Act with approval (gera sob revisão) | as skills `criar-*` |
| Autonomous bounded (mecânico, gate verde) | ajuste trivial sem item human-in-the-loop |

**Human-in-the-loop** — paro e confirmo antes de: migration destrutiva, auth/peso hierárquico,
exclusão de dados (hard delete/cascade), schema core. Lista canônica em `governanca.md`; os gatilhos
também estão no `CLAUDE.md` (sempre carregado).

**Fechamento (closing report)** — cada reviewer encerra com 1 linha (tipo + gaps); a umbrella
`revisar-mudancas` consolida o bloco completo (tipo de mudança · gates aplicáveis · gaps/riscos).

**Auto-update deste setup** — agentes/skills/contexto são ativos versionados e **não se auto-atualizam**.
Ao fechar algo validado: identifique o aprendizado reutilizável, classifique onde mora (agente, skill,
`governanca.md` ou `CLAUDE.md`), proponha a mudança **mínima**, e nunca amplie `tools`/permissão nem
transforme caso pontual em regra global sem o meu ok. Reviewer jamais ganha `Edit`/`Write`.

---

## Como invocar

**Agentes:**
- **Natural** — só pedir ("revisa essa migration", "confere a auth dessa rota"); o agente é escolhido pelo `description`.
- **Explícito** — "usa o `migration-review` aqui".
- **`/agents`** — gerenciador interativo pra editar/testar/criar agentes sem mexer no `.md` na mão.

**Skills:**
- **`/criar-migration <entidade>`** (ex.: `/criar-rota subject`) ou em linguagem natural. O argumento é o nome da entidade; sem ele, a skill pergunta.
- Skills são descobertas no **start da sessão**. Se não aparecerem como `/criar-...`, um `/clear` ou nova sessão reindexa.

---

## Cheat sheet — usar / não usar (agentes)

### `migration-review`
- ✅ Escreveu/alterou migration e quer validar **antes** de `db:migrate` — pega o que quebra no MariaDB em produção.
- ❌ Escrever a migration (use a skill `criar-migration`); migration trivial de 1 `addColumn`; debugar erro de migration em runtime.

### `controller-review`
- ✅ Criou/alterou um controller — confere a mecânica: transação + rollback no early-return, projeção whitelisted em todo retorno, soft delete via `status`, peso hierárquico quando cruza ator, `isValidId`, códigos HTTP, arrow methods.
- ❌ Revisar wiring de rota/flag (use `backend-auth-review`); checar coerência entre controllers (use `api-contract-review`); escrever a regra de negócio.

### `backend-auth-review`
- ✅ Adicionou/alterou rota ou ação de controller — confere o trio `loginRequired` → `roleAuth(flag)` → peso no controller, e que não vazou campo nem deixou rota mutante aberta.
- ❌ Escrever a regra de negócio; decidir *qual* flag uma feature nova deveria ter (decisão de design); testar o fluxo rodando a API.

### `api-contract-review`
- ✅ Novo endpoint, ou mexeu em vários controllers / no `validateRequest` — garante que todos respondem no mesmo formato (`{errors}` plural, envelope de paginação canônico, status HTTP, projeção).
- ❌ Revisar um controller isolado pela mecânica interna (use `controller-review`); revisar autorização (use `backend-auth-review`).

### `ui-kit-review`
- ✅ Criou/alterou página em `pages/` — garante fachada `styled.js` + reuso do `components/ui` (principalmente pegar primitivo duplicado).
- ❌ Construir o componente do zero (use a skill `criar-pagina`); revisar lógica React/Redux ou acessibilidade (fora de escopo de propósito).

> **Fluxo natural:** a skill gera na sessão do domínio; no fim, dispara-se o agente revisor pra um passe limpo em contexto isolado. O agente **aponta**; você decide e corrige.

---

## Quando NÃO usar agente (geral)

- **Escrever** a migration/rota/componente em si — é trabalho de skill + contexto da conversa, que o agente isolado não tem.
- **Debug em runtime** — agente não roda a API nem o dev server pra ver o erro acontecer.
- **Lookup de 1 fato** que sai em 2 greps — disparar agente é overhead.
- Tarefa que **depende de muito do que foi falado** na sessão — o agente começa do zero.

---

## Como tunar

- **`model`** (agentes): hoje os cinco estão em `opus` (rigor máximo na review). `sonnet` é mais barato e dá conta de review delimitado, se quiser reduzir custo; `inherit` usa o modelo da sessão.
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
1. **Aterrar num arquivo-base real** — a skill referencia o esqueleto canônico (ex.: `create-staff.js` p/ migration).
2. **Aceitar argumento** (nome da entidade) e **perguntar** se não vier.
3. **Terminar apontando pro agente revisor** do par (fecha o ciclo fazer → checar).
4. **Arquivos de apoio**: a pasta da skill pode conter scripts/referências lidos sob demanda — não precisa caber tudo no `SKILL.md`.
