#!/usr/bin/env bash
#
# Hook de PreToolUse (Edit|Write) que protege arquivos sensíveis.
#
# O que faz: lê do stdin o JSON que o Claude Code envia antes de gravar, extrai o
# path do arquivo-alvo e o compara com as categorias sensíveis abaixo. Se casar,
# imprime um JSON de decisão que força confirmação humana ("ask") e encerra; se
# não casar, sai sem output e a escrita segue. Roda fora do allow/deny, então
# vale até em modo automático.
#
# Sensível =
#   - migration já versionada (pode estar aplicada; editar diverge os ambientes)
#   - segredo .env (menos o .env.example)
#   - auth (loginRequired/roleAuth) e models de entidade core

set -uo pipefail

input=$(cat)

path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_input.path // empty')
[ -z "$path" ] && exit 0

base=$(basename "$path")

emit_ask() {
  jq -cn --arg r "$1" \
    '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"ask",permissionDecisionReason:$r}}'
  exit 0
}

# segredo .env (libera o .env.example)
case "$base" in
  .env.example) ;;
  .env|.env.*)
    emit_ask "Arquivo de segredo ($base). Confirme a escrita; ao alterar variável, espelhe no docker-compose.yml (CLAUDE.md)."
    ;;
esac

# auth e models de entidade core
case "$path" in
  */middlewares/loginRequired.js|*/middlewares/roleAuth.js)
    emit_ask "Edição em auth ($base) — human-in-the-loop (governance). Confirme a intenção."
    ;;
  */models/User.js|*/models/AccessLevel.js|*/models/Staff.js|*/models/Student.js|*/models/Guardian.js)
    emit_ask "Edição em model de entidade core ($base) — schema core é human-in-the-loop (governance). Confirme."
    ;;
esac

# migration já versionada (tracked no git = provavelmente aplicada)
case "$path" in
  */backend/src/database/migrations/*.js)
    if git -C "${CLAUDE_PROJECT_DIR:-.}" ls-files --error-unmatch -- "$path" >/dev/null 2>&1; then
      emit_ask "Migration já versionada ($base) — pode estar aplicada (SequelizeMeta). Editar cria divergência entre ambientes; o certo é criar uma nova. Confirme se realmente quer editar."
    fi
    ;;
esac

exit 0
