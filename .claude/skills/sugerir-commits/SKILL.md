---
name: sugerir-commits
description: Analisa o working tree (git status + diff) e devolve um plano de commits atômicos no padrão Conventional Commits do usuário, cada um com seu `git add` correspondente. Use quando o usuário pedir explicitamente para sugerir/montar commits, agrupar mudanças pendentes ou perguntar "o que eu preciso commitar". NUNCA executa os commits — só apresenta para o usuário rodar.
---

# Sugerir commits

Codifica a seção **Commits (Conventional Commits)** das preferências do usuário em um procedimento repetível: lê o estado do repositório, agrupa as mudanças em commits atômicos e devolve, para cada um, o par `git add` + mensagem pronta.

## Regra de ouro

**Você não commita.** Esta skill apenas *apresenta* o plano. Quem executa `git add` e `git commit` é o usuário. Nunca rode `git commit` por conta própria — nem como conveniência.

## Procedimento

1. **Levante o estado completo do repositório** (em paralelo):
   - `git status --porcelain` — arquivos modificados, novos (`??`) e deletados (`D`).
   - `git diff` — mudanças não staged.
   - `git diff --cached` — mudanças já staged.
   - Para arquivos novos (untracked), leia o conteúdo relevante para entender o que está sendo adicionado.

2. **Entenda cada mudança.** Não trate o working tree como um bloco único. Leia os diffs o suficiente para saber *o que* mudou e *por quê*, de modo a classificar tipo e escopo corretamente.

3. **Agrupe em commits atômicos.** Cada commit deve ter uma única preocupação coerente. Separe mudanças não relacionadas mesmo que estejam no mesmo arquivo ou na mesma pasta. Critérios de agrupamento:
   - Por **escopo** (`backend`, `frontend`, `database`, `auth`).
   - Por **preocupação** (uma feature, um fix, um refactor — não misture).
   - Um de-dup/refactor não entra junto de uma feature nova.

4. **Ordene por dependência.** O que é base vem primeiro (ex.: migration antes do código que a consome; criação de um hook compartilhado antes do consumo).

5. **Para cada commit, devolva:**
   - O `git add` com os caminhos **exatos** daquele commit (nunca `git add .` / `git add -A` — o agrupamento se perde).
   - A mensagem no padrão obrigatório (abaixo).

## Padrão da mensagem (obrigatório)

- **Header:** `<tipo>(<escopo>): <descrição em pt-br, mantendo em inglês só o necessário>`
- **Tipos:** `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `perf`.
- **Escopo:** área afetada — ex.: `(backend)`, `(frontend)`, `(database)`, `(auth)`.
- **Body** (obrigatório em mudanças complexas): lista com `-` detalhando tecnicamente o que mudou; explique o "porquê" só se for crítico.
- Identificadores (variáveis, funções, arquivos) em inglês dentro da descrição.

## Formato de saída

Apresente os commits em ordem de execução. Para cada um, um bloco shell copiável com o `git add` seguido do `git commit`. Exemplo de forma:

```bash
# 1 — de-dup do hook compartilhado
git add frontend/src/pages/User/UserManagement/hooks/useUsersData.js
git commit -m "refactor(frontend): aponta useDebounce do módulo User para o hook compartilhado"
```

Para mensagens com body, use múltiplos `-m` ou here-doc, mantendo a lista do body com `-`.

Depois do plano, pare. Não execute, não pergunte se pode commitar — o usuário decide e roda.
