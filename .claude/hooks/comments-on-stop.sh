#!/usr/bin/env bash
#
# Hook de Stop que audita os COMENTÁRIOS adicionados no turno.
#
# Existe porque a regra de comentários do CLAUDE.md global (pt-br, só em
# complexidade real, sem narrativa) falhou repetidamente como instrução
# declarativa. Esta é a camada determinística; o julgamento semântico
# ("o comentário é verdadeiro?") é do agente `comment-review`.
#
# O que checa, só nas linhas de comentário ADICIONADAS no turno:
#   1. Narrativa  — "antes era", "agora", "de propósito", "decisão do", TODO/FIXME.
#      O comentário declara restrição: impessoal e atemporal.
#   2. Idioma     — palavra funcional em inglês (o comentário é pt-br; identificador
#      em inglês dentro do texto é normal e não dispara).
#   3. Densidade  — arquivo muito acima dos irmãos do mesmo diretório. É o check que
#      pega "comentei demais" sem precisar julgar cada comentário.
#
# Tolerância: `.claude/hooks/comments-allow.txt` (substrings, uma por linha) isenta
# padrões já replicados no projeto — sem isso o hook vira ruído e é ignorado.
#
# Fail-open (sai limpo) quando: é continuação do próprio hook, falta jq/git, ou
# não há arquivo de código alterado no turno.
set -uo pipefail

input=$(cat)

# guarda de loop: numa continuação deste hook, deixa encerrar
active=$(printf '%s' "$input" | jq -r '.stop_hook_active // false' 2>/dev/null || echo false)
[ "$active" = "true" ] && exit 0

proj="${CLAUDE_PROJECT_DIR:-.}"
cd "$proj" || exit 0
command -v jq >/dev/null 2>&1 || exit 0

allow_file="$proj/.claude/hooks/comments-allow.txt"

SCOPE=(backend/src frontend/src backend/test)

files=$(
  {
    git diff --name-only --diff-filter=ACMR HEAD -- "${SCOPE[@]}" 2>/dev/null
    git ls-files --others --exclude-standard -- "${SCOPE[@]}" 2>/dev/null
  } | grep -E '\.(js|jsx)$' | sort -u
)
[ -z "$files" ] && exit 0

NARRATIVE='antes era|antes,|antes o |antes a |agora é|agora o |agora a |agora não|de propósito|decisão d|decidimos|mudamos|alteramos|foi alterado|foi mudado|passou a ser|por enquanto|temporariamente|\b(TODO|FIXME|XXX|HACK)\b|gambiarra'
ENGLISH='\b(the|this|that|these|those|is|are|was|were|will|would|should|could|must|does|doesn|returns|only|when|because|instead|otherwise|our|its|it'"'"'s)\b'

is_allowed() {
  [ -s "$allow_file" ] || return 1
  local line="$1" pattern
  while IFS= read -r pattern; do
    [ -z "$pattern" ] && continue
    case "$pattern" in \#*) continue ;; esac
    case "$line" in *"$pattern"*) return 0 ;; esac
  done < "$allow_file"
  return 1
}

# densidade em comentários por mil linhas; -1 = arquivo curto demais para julgar.
# Linhas isentas pela allowlist não contam: senão o padrão de separadores do
# redux-saga acusaria densidade alta em todo actions.js/reducer.js.
density() {
  local f="$1" total com line
  [ -f "$f" ] || { echo -1; return; }
  total=$(wc -l < "$f" 2>/dev/null)
  total=${total:-0}
  [ "$total" -lt 60 ] && { echo -1; return; }
  com=0
  while IFS= read -r line; do
    is_allowed "$line" && continue
    com=$(( com + 1 ))
  done < <(grep -E '^[[:space:]]*(//|\*|/\*)' "$f" 2>/dev/null)
  echo $(( com * 1000 / total ))
}

findings=""

for f in $files; do
  [ -f "$f" ] || continue

  # comentários adicionados no turno: linhas '+' do diff; arquivo novo = tudo
  if git ls-files --error-unmatch "$f" >/dev/null 2>&1; then
    added=$(git diff -U0 HEAD -- "$f" 2>/dev/null | grep '^+' | grep -v '^+++' | sed 's/^+//')
  else
    added=$(cat "$f" 2>/dev/null)
  fi
  comments=$(printf '%s\n' "$added" | grep -nE '^[[:space:]]*(//|\{/\*|/\*)' || true)
  [ -z "$comments" ] && continue

  while IFS= read -r line; do
    [ -z "$line" ] && continue
    text=${line#*:}
    is_allowed "$text" && continue

    if printf '%s' "$text" | grep -qiE "$NARRATIVE"; then
      findings+="  [narrativa] $f: ${text#"${text%%[![:space:]]*}"}"$'\n'
    elif printf '%s' "$text" | grep -qiE "$ENGLISH"; then
      findings+="  [idioma] $f: ${text#"${text%%[![:space:]]*}"}"$'\n'
    fi
  done <<< "$comments"

  # densidade contra os irmãos do mesmo diretório
  d_file=$(density "$f")
  [ "$d_file" -lt 0 ] && continue
  dir=$(dirname "$f")
  sib_sum=0; sib_n=0
  for s in "$dir"/*.js; do
    [ -f "$s" ] || continue
    [ "$s" = "$f" ] && continue
    d_s=$(density "$s")
    [ "$d_s" -lt 0 ] && continue
    sib_sum=$(( sib_sum + d_s )); sib_n=$(( sib_n + 1 ))
  done
  [ "$sib_n" -eq 0 ] && continue
  sib_avg=$(( sib_sum / sib_n ))
  if [ "$d_file" -gt 40 ] && [ "$d_file" -gt $(( sib_avg * 2 )) ]; then
    findings+="  [densidade] $f: $(( d_file / 10 ))% de comentários vs $(( sib_avg / 10 ))% dos irmãos de $dir/"$'\n'
  fi
done

[ -z "$findings" ] && exit 0

reason="Auditoria de comentários (CLAUDE.md global) acusou o seguinte nos arquivos do turno:

$findings
Regra: comentário só onde há complexidade real — a maioria não deve existir. Em pt-br,
impessoal e atemporal, declarando restrição. Justificativa e raciocínio vão para a resposta
ou docs/, nunca no bloco de código.

Corrija ou, se for padrão legítimo já replicado no projeto, acrescente a substring em
.claude/hooks/comments-allow.txt. Para julgar se cada comentário é verdadeiro e se precisa
existir, rode o agente comment-review."

jq -cn --arg r "$reason" '{decision:"block", reason:$r}'
exit 0
