---
name: suggest-commits
description: Analisa o working tree (git status + diff) e devolve um plano de entrega — se necessário, a branch a criar/trocar antes — e os commits atômicos no padrão Conventional Commits do usuário, cada um com seu `git add`. Use quando o usuário pedir para sugerir/montar commits, agrupar mudanças pendentes ou perguntar "o que eu preciso commitar". NUNCA executa branch nem commits — só apresenta para o usuário rodar.
---

# Sugerir commits

Codifica a seção **Commits (Conventional Commits)** das preferências do usuário em um procedimento repetível: lê o estado do repositório, **decide em que branch os commits devem cair**, agrupa as mudanças em commits atômicos e devolve, para cada um, o par `git add` + mensagem pronta.

## Regra de ouro

**Você não executa nada.** Esta skill apenas *apresenta* o plano — a ação de branch **e** os commits. Quem roda `git switch`/`git branch`, `git add` e `git commit` é o usuário. Nunca crie branch nem commite por conta própria — nem como conveniência.

## Procedimento

1. **Levante o estado completo do repositório** (em paralelo):
   - `git branch --show-current` — branch atual (e se é a default do projeto, ex.: `main`).
   - `git status --porcelain` — arquivos modificados, novos (`??`) e deletados (`D`).
   - `git diff` — mudanças não staged.
   - `git diff --cached` — mudanças já staged.
   - Para arquivos novos (untracked), leia o conteúdo relevante para entender o que está sendo adicionado.

2. **Entenda cada mudança.** Não trate o working tree como um bloco único. Leia os diffs o suficiente para saber *o que* mudou e *por quê*, de modo a classificar tipo e escopo corretamente.

3. **Decida a branch** (antes de agrupar — ver "Decisão de branch"). Onde esses commits devem cair? Se a branch atual não serve, a criação/troca vem **antes** dos commits no plano.

4. **Agrupe em commits atômicos.** Cada commit deve ter uma única preocupação coerente. Separe mudanças não relacionadas mesmo que estejam no mesmo arquivo ou na mesma pasta. Critérios de agrupamento:
   - Por **escopo** (`backend`, `frontend`, `database`, `auth`).
   - Por **preocupação** (uma feature, um fix, um refactor — não misture).
   - Um de-dup/refactor não entra junto de uma feature nova.

5. **Ordene por dependência.** O que é base vem primeiro (ex.: migration antes do código que a consome; criação de um hook compartilhado antes do consumo).

6. **Para cada commit, devolva:**
   - O `git add` com os caminhos **exatos** daquele commit (nunca `git add .` / `git add -A` — o agrupamento se perde).
   - A mensagem no padrão obrigatório (abaixo).

## Decisão de branch

Decida **onde** os commits caem antes de listá-los:

- **Nunca commite direto na branch default (`main`).** Se HEAD está na `main`, sugira criar uma feature branch **antes** dos commits — o fluxo do projeto é PR-based (branch → commits → PR → merge).
- **Naming:** `<tipo>/<escopo>-<descrição-curta>`, coerente com o header dos commits e o histórico (ex.: `chore/backend-typecheck-optin`, `docs/governance-hooks-comments`). O `<tipo>` reflete a preocupação dominante da pilha.
- **Reaproveite a branch atual** se já for uma feature branch cuja preocupação bate com a mudança pendente — não troque à toa. Diga explicitamente "permanece na branch atual (`<nome>`)".
- **Nova branch** se a mudança é de preocupação diferente da branch atual (feature branch de outra coisa) — sugira `git switch -c` a partir da base.
- **Múltiplas preocupações independentes** (que iriam para branches/PRs distintos): proponha **uma branch por grupo**, com os commits daquele grupo sob ela, e aponte o `suggest-prs` para o fatiamento de entrega completo (título/corpo de cada PR).

## Padrão da mensagem (obrigatório)

- **Header:** `<tipo>(<escopo>): <descrição em pt-br, mantendo em inglês só o necessário>`
- **Tipos:** `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `perf`.
- **Escopo:** área afetada — ex.: `(backend)`, `(frontend)`, `(database)`, `(auth)`.
- **Body** (obrigatório em mudanças complexas): lista com `-` detalhando tecnicamente o que mudou; explique o "porquê" só se for crítico.
- Identificadores (variáveis, funções, arquivos) em inglês dentro da descrição.

## Formato de saída

Apresente **primeiro a ação de branch** (se houver), depois os commits em ordem de execução — todos como blocos shell copiáveis.

1. **Branch** — o `git switch -c <branch>` (ou a nota "permanece na branch atual (`<nome>`)"). Se >1 branch, deixe claro quais commits vão sob cada uma.
2. **Commits** — cada um com `git add` (paths exatos) seguido do `git commit`.

```bash
# branch (só se a atual não serve — ex.: você está na main)
git switch -c chore/backend-ts-check-expand

# 1 — de-dup do hook compartilhado
git add frontend/src/pages/User/UserManagement/hooks/useUsersData.js
git commit -m "refactor(frontend): aponta useDebounce do módulo User para o hook compartilhado"
```

Para mensagens com body, use múltiplos `-m` ou here-doc, mantendo a lista do body com `-`.

Depois do plano, pare. Não execute, não pergunte se pode commitar ou branchar — o usuário decide e roda.
