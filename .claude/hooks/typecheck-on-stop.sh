#!/usr/bin/env bash
#
# Hook de Stop que checa tipos ao fim do turno do Claude.
#
# O que faz: lê do stdin o JSON do hook e roda `tsc --noEmit` sobre os arquivos
# opt-in `// @ts-check` do backend. Se passa, sai sem output (silencioso); se há
# erro de tipo, imprime um JSON de decisão `block` devolvendo a saída do tsc pro
# Claude corrigir antes de encerrar o turno.
#
# Não bloqueia (fail-open, sai limpo) quando:
#   - é uma continuação do próprio hook (loop guard: stop_hook_active)
#   - o tsc não está instalado no backend
#   - não há nenhum arquivo `// @ts-check` em backend/src

set -uo pipefail

input=$(cat)

# guarda de loop: se já estamos numa continuação deste hook, deixa encerrar
active=$(printf '%s' "$input" | jq -r '.stop_hook_active // false')
[ "$active" = "true" ] && exit 0

proj="${CLAUDE_PROJECT_DIR:-.}"
tsc="$proj/backend/node_modules/.bin/tsc"

# fail-open: sem o binário do tsc, não bloqueia
[ -x "$tsc" ] || exit 0

# curto-circuito: nenhum arquivo // @ts-check em backend/src → nada a checar
grep -rqI --include='*.js' -e '@ts-check' "$proj/backend/src" 2>/dev/null || exit 0

out=$("$tsc" -p "$proj/backend/jsconfig.json" 2>&1)
[ $? -eq 0 ] && exit 0

reason="tsc --noEmit falhou em arquivo(s) // @ts-check. Corrija os tipos antes de encerrar:
$(printf '%s' "$out" | grep 'error TS' | head -30)"

jq -cn --arg r "$reason" '{decision:"block", reason:$r}'
exit 0
