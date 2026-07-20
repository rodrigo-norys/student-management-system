---
name: review-changes
description: Umbrella de code review. Lê o diff atual (git status/diff), classifica os arquivos alterados por domínio e dispara em paralelo os agentes revisores certos (migration-review, controller-review, backend-auth-review, api-contract-review, ui-kit-review, comment-review), consolidando os achados em um relatório único por severidade. Use antes de commitar/abrir PR para um passe de revisão completo.
---

# Revisar mudanças

Orquestra os agentes revisores do projeto sobre o **diff atual**. Você (contexto da sessão) faz o roteamento; cada agente roda **isolado** e devolve só a conclusão. Não corrige — consolida o que apontar.

**Argumento opcional:** um escopo (`backend`, `frontend`, ou um caminho). Sem argumento, revisa tudo que está sujo no working tree.

## Passos

### 1. Levantar o diff
Rode, na raiz do projeto:
- `git status --porcelain` — lista arquivos modificados/novos.
- `git diff` e `git diff --staged` — o conteúdo das mudanças (staged + unstaged).

Se o argumento restringir o escopo, filtre os caminhos por ele.

### 2. Classificar por domínio e rotear

Mapeie cada arquivo alterado para os agentes correspondentes (um arquivo pode acionar mais de um):

| Caminho alterado | Agente(s) |
|---|---|
| `backend/src/database/migrations/*.js` | `migration-review` **+** `db-schema-review` (se muda estrutura/FK/índice) |
| `backend/src/controllers/*.js` | `controller-review` **+** `backend-auth-review` |
| `backend/src/routes/*.js` | `backend-auth-review` |
| **≥ 2** controllers/rotas tocados, ou mudança em `middlewares/validateRequest.js` | `api-contract-review` |
| `frontend/src/pages/**` | `ui-kit-review` |
| `backend/src/models/*.js` | `model-review` *(quando existir; até lá, revisão manual)* |
| `docker-compose.yml`, `Dockerfile*`, `frontend/Caddyfile`, `.env.example` | `infra-review` |
| auth/upload/query pesada (rate-limit, bcrypt, N+1, índices aninhados) | `security-perf-review` *(quando existir)* |
| **qualquer arquivo de código com comentário adicionado no diff** | `comment-review` |

Regras de roteamento:
- **`comment-review` é transversal e quase sempre aplicável**: dispare sempre que o diff adicionar linha de comentário, em qualquer domínio. O hook `comments-on-stop.sh` já barra forma (narrativa, idioma, densidade); o agente é a única camada que pega **comentário factualmente errado** — o que descreve mecanismo que o código não tem. Diff sem comentário novo: pule.
- **`api-contract-review` é transversal**: dispare quando a mudança puder afetar a coerência entre endpoints (vários controllers, novo endpoint, mexeu no envelope de erro/paginação). Para um controller isolado, `controller-review` já basta.
- **Migration trivial** (1 `addColumn`) não precisa de `migration-review` — sinalize e pule, não gaste o disparo.
- Domínio sem agente (ex.: `store/`, `config/`, model puro) não tem revisor dedicado: revise você mesmo no relatório, marcando como "revisão manual".

### 3. Disparar em paralelo
Use a ferramenta Agent para cada revisor selecionado, **em um único bloco de chamadas** (paralelo), passando no prompt:
- a lista de arquivos do domínio dele **e os hunks do diff (passo 1) desses arquivos** — os revisores são `Read, Grep, Glob` e não enxergam git: o que não for colado no prompt não existe para eles;
- a instrução de focar **apenas** nas mudanças do diff (não auditar o repo inteiro).

### 4. Consolidar

**Achado de agente é alegação, não fato.** Antes de consolidar, abra o `arquivo:linha` citado e confirme na fonte. O que a fonte contradisser, descarte; o que ela não sustentar, rebaixe. O revisor roda isolado e erra tipicamente ao chamar de "novo nesta fatia" o que é pré-existente, e ao apontar o que o código já trata.

Junte os retornos em **um** relatório, agrupado por severidade (Bloqueante / Alto / Médio / Informativo), **não** por agente. Cada item mantém `arquivo:linha` + problema + risco, com a tag do revisor de origem. No fim:
- **Veredito**: pode commitar/abrir PR, ou há bloqueante a resolver antes.
- Se algum domínio ficou sem revisor, registre o que você checou manualmente.
- **Fechamento consolidado** (formato em `.claude/context/governance.md`): **tipo de mudança** do diff · **gates aplicáveis** e se rodaram ou ficam recomendados · **gaps/riscos** e aprovações human-in-the-loop pendentes (migration destrutiva, auth/peso, exclusão de dados, schema core).

> Não corrija aqui — os agentes apontam, você decide. Para os fixes, volte ao contexto da sessão do domínio. Depois de limpo: `suggest-prs` para a descrição e `suggest-commits` para o plano de commits.
