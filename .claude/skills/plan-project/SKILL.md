---
name: plan-project
description: Macro-planner de épicos/fases. Recebe um objetivo de épico (ex.: "fechar Tier 3"), decompõe em fatias verticais pela cadeia canônica, sequencia por dependência, marca HITL/gates e consulta/atualiza docs/roadmap.md. Irmã macro da plan-feature (que fica para 1 fatia). Roda na sessão — NÃO implementa nem commita.
---

# Planejar projeto

Orquestrador-como-skill no nível de **épico/fase** (não 1 feature). Roda no contexto da sessão, decompõe um objetivo grande em fatias verticais e as sequencia pela cadeia canônica. **Não escreve código nem commita** — produz o plano e para no seu aceite. É a irmã macro da `plan-feature` (que fica para 1 fatia).

**Argumento:** o objetivo do épico (ex.: `/plan-project fechar Tier 3`, `/plan-project multitenant`). Sem argumento, pergunte qual épico/fase vamos planejar.

## Passos

### 1. Situar no roadmap
- Leia `docs/roadmap.md`: a fase atual ("VOCÊ ESTÁ AQUI"), o critério de saída dela e as dependências entre fases. O épico pedido pertence a qual fase?
- Para o estado real (o que já existe vs o que o roadmap afirma), dispare o agente `state-audit` em vez de assumir — ele devolve o drift em contexto isolado.

### 2. Decompor o épico em fatias verticais
Cada entidade/capacidade é uma **fatia** que percorre a cadeia canônica. Liste-as e ordene **por dependência** (ex.: `StaffUnit` antes do multitenant que depende dele — `roadmap.md` §3A). Sequenciamento é decisão de arquitetura, não acaso.

### 3. Delegar cada fatia à `plan-feature`
Não re-detalhe aqui o que a `plan-feature` já faz por fatia (model → migration → controller → rota → página + revisor do par). Marque qual skill abre cada fatia e remeta — você orquestra no nível do épico, ela no nível da fatia.

### 4. Marcar HITL e gates da fase inteira
Conforme `.claude/context/governance.md`: quais fatias tocam **auth/peso**, **schema core**, **exclusão de dados**, **migration destrutiva** ou **cutover** (human-in-the-loop). E os gates da fase (backend `npm test`, frontend `CI=true npm run build`, reviewers do par, `api-contract-review` se ≥2 controllers/`validateRequest`).

### 5. Entregar o plano e propor a atualização do roadmap
Saída:
- **Diagnóstico do épico** — escopo, fatias, dependências, fase do roadmap.
- **Sequência de fatias** — ordem por dependência, cada uma com a skill que a abre e o revisor do par.
- **HITL / gates** da fase.
- **Atualização proposta do `docs/roadmap.md`** — o que marcar como em-progresso/feito e o drift que o `state-audit` apontou. É **proposta**: você aceita antes de eu editar o roadmap.

> Não implemente aqui. Com o seu OK, cada fatia roda pela `plan-feature` → skills `criar-*` → revisores, e no fim `review-changes` → `suggest-prs` → `suggest-commits`. O `docs/roadmap.md` só é editado com seu aceite explícito.
