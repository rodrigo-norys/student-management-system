---
name: plan-feature
description: Orquestrador de planejamento. Decompõe uma feature/entidade nova na cadeia canônica do projeto (model → migration → controller → rota → página), marca os passos aplicáveis, os pontos human-in-the-loop e os gates, e devolve um plano por passos para o seu OK. Roda na sessão — NÃO implementa nem commita sozinho. Use ao iniciar uma feature do zero, antes de sair criando arquivo.
---

# Planejar feature

Orquestrador-como-skill: roda no **contexto da sessão** (não é agente), decompõe a feature e
roteia para as skills `create-*` e os reviewers certos. Análogo ao `review-changes`, mas na
**entrada** do trabalho em vez da saída. **Não escreve código nem commita** — produz o plano e
para no seu aceite. Subagente Claude é um nível só, então a orquestração mora aqui, na sessão.
Escopo: esta skill é para **uma fatia/feature**; para um **épico/fase inteira** (multi-entidade),
use o macro-planner `plan-project`, que decompõe em fatias e chama esta por fatia.

**Argumento:** descrição da feature ou nome da entidade (ex.: `/plan-feature subject`,
`/plan-feature alocar professor em turma`). Sem argumento, pergunte o que vamos planejar
antes de seguir.

## Passos

### 1. Entender o objetivo e o que já existe
- Leia os relacionamentos no `CLAUDE.md` (Tiers 1–5) para situar a(s) entidade(s) e suas FKs.
- Para recon do que já existe (model criado? controller irmão? rota registrada?), se a sessão
  não tiver esse contexto, dispare um agente `Explore` em vez de poluir a conversa.

### 2. Classificar a feature
Decisões que mudam o plano:
- **Entidade folha vs cruza ator** — toca outro ator (`users`/`staff`/`students`/`guardians`)?
  Se sim, o controller precisa de peso hierárquico → forma completa (ver `create-controller`).
- **Frontend local vs global** — estado só na tela (hooks, padrão User) ou entidade cross-app
  (redux-sagas, padrão Student)? Cruze com o modelo de dados (ver `create-page`).
- **Precisa de schema?** — tabela/coluna/FK nova → tem migration + model. Senão, pule esses passos.

### 3. Decompor na cadeia canônica
Marque **quais passos aplicam** e o revisor do par de cada um:

| Passo | Skill | Revisor do par | Aplica? |
|---|---|---|---|
| 1 | `create-model` | (via migration/controller) | sim se schema novo |
| 2 | `create-migration` | `migration-review` | sim se schema novo |
| 3 | `create-controller` | `controller-review` (+ `backend-auth-review`) | sim se expõe a entidade |
| 4 | `create-route` | `backend-auth-review` | sim se há HTTP |
| 5 | `create-page` | `ui-kit-review` | sim se há UI |

### 4. Marcar os pontos human-in-the-loop
Conforme `.claude/context/governance.md`: migration destrutiva, auth/peso hierárquico, exclusão
de dados, schema core. Liste explicitamente onde a feature vai me pedir aprovação.

### 5. Levantar os gates
Conforme `.claude/context/governance.md` → seção "Gates reais". Diga quais valem para esta
feature (backend `npm test`, frontend `CI=true npm run build`, `migration-review`,
`api-contract-review` se mexer em ≥2 controllers/`validateRequest`).

### 6. Entregar o plano e parar
Saída:
- **Diagnóstico** — o que a feature é, entidades/Tiers e relacionamentos impactados.
- **Plano por passos** — a cadeia do passo 3, só os passos aplicáveis, em ordem, cada um com
  seu revisor.
- **Pontos de aprovação humana** — os do passo 4.
- **Gates** — os do passo 5.
- **Riscos / decisões em aberto** — local vs global, mínima vs completa, FKs ambíguas.

> **Não implemente aqui.** Peça o meu OK. Com o aceite, executo as skills `create-*` na sessão
> (cada passo aponta seu reviewer), e no fim `review-changes` → `suggest-prs` → `suggest-commits`
> fecham a entrega.
