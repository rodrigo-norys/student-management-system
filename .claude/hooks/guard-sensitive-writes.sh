#!/usr/bin/env bash
#
# PreToolUse guard (matcher: Edit|Write) — classifica o path da edição e força
# confirmação humana (permissionDecision: "ask") em arquivos sensíveis.
# Roda fora do allow/deny, então vale mesmo em acceptEdits/auto.
#
# Cobre 3 regras consolidadas:
#   #1 migration já versionada (proxy de "aplicada na SequelizeMeta")
#   #2 arquivo de segredo .env (exceto .env.example)
#   #3 auth (loginRequired/roleAuth) e models de entidade core
#
# Contrato: stdin = JSON do hook; stdout = JSON de decisão; exit 0.
# Qualquer path não-sensível: exit 0 sem output (= allow).

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

# #2 — segredo (.env e variantes), liberando o template versionado
case "$base" in
  .env.example) ;;
  .env|.env.*)
    emit_ask "Arquivo de segredo ($base). Confirme a escrita; ao alterar variável, espelhe no docker-compose.yml (CLAUDE.md)."
    ;;
esac

# #3 — auth e models de entidade core (sinais path-based confiáveis)
case "$path" in
  */middlewares/loginRequired.js|*/middlewares/roleAuth.js)
    emit_ask "Edição em auth ($base) — human-in-the-loop (governance). Confirme a intenção."
    ;;
  */models/User.js|*/models/AccessLevel.js|*/models/Staff.js|*/models/Student.js|*/models/Guardian.js)
    emit_ask "Edição em model de entidade core ($base) — schema core é human-in-the-loop (governance). Confirme."
    ;;
esac

# #1 — migration já versionada (tracked no git ⇒ provavelmente aplicada)
case "$path" in
  */backend/src/database/migrations/*.js)
    if git -C "${CLAUDE_PROJECT_DIR:-.}" ls-files --error-unmatch -- "$path" >/dev/null 2>&1; then
      emit_ask "Migration já versionada ($base) — pode estar aplicada (SequelizeMeta). Editar cria divergência entre ambientes; o certo é criar uma nova. Confirme se realmente quer editar."
    fi
    ;;
esac

exit 0
