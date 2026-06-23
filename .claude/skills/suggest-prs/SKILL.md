---
name: suggest-prs
description: Propõe como fatiar o trabalho não-mergeado em 1+ Pull Requests (agrupados por preocupação, ordenados por dependência, com branch sugerida por PR) E escreve título + corpo de cada um no padrão do projeto (header Conventional Commits + corpo estruturado em seções de markdown, escolhidas conforme o conteúdo de cada PR). Contraparte reativa do plan-project. Use ao preparar/abrir PR(s). Só produz markdown — NUNCA roda gh pr create nem commita.
---

# Suggest PRs

Decide a **estrutura de entrega** de uma pilha de mudanças: quantos PRs, o que entra em cada um, e a descrição de cada um. **Descrever 1 PR é o caso N=1** — pilha coesa vira um PR só. **Só produz texto** — você revisa e abre. Não executa `gh`, não commita (mesma regra do `suggest-commits`).

**Argumento opcional:** a branch base (default `main`).

> **Quando usar vs `plan-project`:** o `plan-project` fatia **proativamente** no planejamento (cada fatia vertical = 1 PR). O `suggest-prs` fatia **reativamente** uma pilha já acumulada no working tree/branch que não foi decomposta antes.

## Passos

### 1. Levantar o diff
- `git rev-parse --abbrev-ref HEAD` — branch atual.
- `git log --oneline main..HEAD` — commits da branch (insumo do "o que mudou").
- `git diff main...HEAD --stat` e `git diff main...HEAD` — escopo e conteúdo.

Se a branch ainda não tem commits (mudanças só no working tree), use `git status` + `git diff` e diga isso no fim.

### 2. Decidir o número de PRs
Pergunta central: **a pilha é uma preocupação coesa, ou várias não-relacionadas?**
- **1 PR** — tudo serve a um mesmo objetivo (uma feature, um refactor, um fix + seus testes). É o caso comum.
- **N PRs** — separe quando misturar preocupações independentes (ex.: uma feature **+** um refactor não-relacionado **+** docs soltas), ou quando uma parte é base da outra e ganha sendo revisada/mergeada antes.

Critérios de corte: **preocupação** (uma por PR), **dependência** (base antes do que consome), **revisabilidade** (PR que cabe na cabeça do revisor). Na dúvida, prefira **menos** PRs — não fatie por fatiar.

### 3. Para cada PR
- **Branch sugerida** — `<tipo>/<escopo>-<descrição-curta>` (ex.: `chore/claude-tooling-reorg`).
- **Escopo** — quais arquivos/áreas entram (o suficiente pra delimitar; não liste o diff inteiro).
- **Título** — header Conventional Commits (`<tipo>(<escopo>): <descrição pt-br>`).
- **Corpo** — estruturado em **seções de markdown (`##`)**, escolhidas conforme o que o PR contém (não um conjunto fixo). Sempre um resumo do que muda; adicione seções de verificação/testes, risco/notas, comentários de review resolvidos, deploy/migração **só quando relevantes** àquele PR. Cada seção é uma lista de bullets.

```markdown
<tipo>(<escopo>): <descrição em pt-br>

## Resumo
- <um bullet por mudança técnica relevante; cite arquivo/módulo quando ajudar>

## Testes              ← quando houver verificação relevante
- <comando do projeto> — PASS/FAIL

## Risco / notas       ← quando houver caveat
- <itens transversais: env var nova, migration a rodar, recreate de container, breaking change>
```
> As seções são **ilustrativas** — adapte os títulos e quais entram ao conteúdo do PR (ex.: "Comentários resolvidos" se endereça review automatizado; "Deploy" se exige passo de virada). O essencial é a **estrutura seccionada**, não um template engessado.

Exemplo (estilo-alvo de **um** PR — seções adaptadas ao conteúdo):

```markdown
feat(auth): acesso demo read-only one-click para a landing

## Resumo
- Endpoint POST /tokens/demo: loga o usuário demo (via DEMO_USER_EMAIL) e emite o cookie HttpOnly, sem credenciais no front
- Guard em loginRequired bloqueia toda mutação (método ≠ GET) do nível demo
- Frontend: action/saga demoLogin (POST /tokens/demo → /dashboard), flag isDemo no reducer, CTA "Acessar demo" na landing + banner no Layout

## Testes
- npm test (backend) — PASS
- CI=true npm run build (frontend) — PASS

## Risco / notas
- Env nova: DEMO_USER_EMAIL, DEMO_USER_PASSWORD, DEMO_LEVEL_ID — refletir no .env E no docker-compose da VPS
```
> Sem review automatizado a resolver aqui, então não há seção de "Comentários resolvidos" — só entram as seções que fazem sentido pro PR.

### 4. Sequência e handoff
- Se **>1 PR**, dê a **ordem de abertura** (por dependência) e a relação entre eles (ex.: "PR 2 depende do 1").
- Por PR, sugira o comando (pro usuário rodar, **não** você):
```
gh pr create --base <base> --title "<header>" --body-file <arquivo>
```
- Os **commits** de cada PR são planejados pelo `suggest-commits` — este aqui para no nível do PR.

### 5. Regras de conteúdo
- **Header** no padrão Conventional Commits do usuário, coerente com os commits da branch.
- **Corpo = seções de markdown adequadas ao PR** (não um template fixo): sempre um resumo; testes, risco/notas, comentários resolvidos, deploy etc. **só quando relevantes**. Bullets em pt-br (identificadores/código em inglês).
- **Um bullet por mudança técnica relevante** no resumo; prefixe por área quando ajudar (`Backend:`/`Frontend:`/`Seeder:`/`Testes:`). Não faça dump do diff — só o que importa.
- **Verificação/testes:** liste os comandos do projeto (backend `npm test`; frontend `CI=true npm run build`) com **PASS/FAIL** — preencher após rodar.
- **Aterre no diff real.** Não invente passo nem placeholder.
- **Itens transversais vão numa seção de risco/notas:** migration que precisa rodar, env var nova (refletir em `.env` E docker-compose), recreate de container, breaking change de contrato, caveat de deploy.

> Antes de abrir: rode `review-changes` para o passe de revisão e `suggest-commits` para o plano de commits de cada PR.
