#!/usr/bin/env bash
#
# Hook de Stop que formata (Prettier) e checa lint (ESLint) ao fim do turno.
#
# O que faz:
#   1. Coleta os arquivos JS/JSX/CSS alterados no turno (diff vs HEAD + untracked)
#      em backend/src e frontend/src.
#   2. Roda `prettier --write` neles — determinístico, muta em silêncio. O
#      .prettierignore da raiz é respeitado (rodamos do root, CWD = raiz).
#   3. Roda `eslint` (SEM --fix) nos arquivos de backend/src. Se acusa erro,
#      devolve `{decision:"block"}` pro Claude corrigir antes de encerrar — mesmo
#      contrato do typecheck-on-stop. NÃO auto-corrige lint: evita churn e
#      mudança semântica não revisada (ex.: apagar um import que era bug, não lixo).
#
# Fail-open (sai limpo, não bloqueia) quando:
#   - é continuação do próprio hook (loop guard: stop_hook_active)
#   - faltam os binários de prettier/eslint no backend
#   - não há arquivo alterado no turno
set -uo pipefail

input=$(cat)

# guarda de loop: numa continuação deste hook, deixa encerrar
active=$(printf '%s' "$input" | jq -r '.stop_hook_active // false')
[ "$active" = "true" ] && exit 0

proj="${CLAUDE_PROJECT_DIR:-.}"
cd "$proj" || exit 0

prettier="$proj/backend/node_modules/.bin/prettier"
eslint="$proj/backend/node_modules/.bin/eslint"

# arquivos do turno: modificados/adicionados/renomeados (sem deletados) + untracked
files=$(
  {
    git diff --name-only --diff-filter=ACMR HEAD -- backend/src frontend/src 2>/dev/null
    git ls-files --others --exclude-standard -- backend/src frontend/src 2>/dev/null
  } | grep -E '\.(js|jsx|css)$' | sort -u
)

[ -z "$files" ] && exit 0

# 1) Prettier --write (idempotente). .prettierignore da raiz vale (CWD = raiz).
if [ -x "$prettier" ]; then
  printf '%s\n' "$files" | xargs -r -d '\n' "$prettier" --write --ignore-unknown >/dev/null 2>&1
fi

# 2) ESLint como check-and-block (sem --fix), só backend/src/*.js
backend_files=$(printf '%s\n' "$files" | grep '^backend/src/' | grep -E '\.js$' || true)
[ -z "$backend_files" ] && exit 0
[ -x "$eslint" ] || exit 0

out=$(cd "$proj/backend" && printf '%s\n' "$backend_files" | sed 's|^backend/||' | xargs -r -d '\n' "$eslint" 2>&1)
status=$?
[ "$status" -eq 0 ] && exit 0

reason="ESLint acusou problema(s) nos arquivos do turno. Corrija antes de encerrar:
$(printf '%s' "$out" | head -40)"

jq -cn --arg r "$reason" '{decision:"block", reason:$r}'
exit 0
