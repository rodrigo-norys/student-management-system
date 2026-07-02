---
name: add-ts-check
description: Analisa um diretório de backend/src e adota o type-check opt-in (// @ts-check) nos melhores candidatos — rankeia por payoff (fronteira de lib, contrato claro, baixa rotatividade) e, sob aprovação, adiciona a marca + o JSDoc mínimo pra passar no tsc. Use para expandir a cobertura de tipos do backend; o Stop hook typecheck-on-stop valida no fim. Sem diretório, pergunte.
---

# Adotar `// @ts-check`

Analisa um diretório de `backend/src` e adota o type-check **opt-in** nos melhores candidatos: rankeia por payoff e, sob aprovação, adiciona `// @ts-check` + o JSDoc mínimo pra passar no `tsc`. **Base:** `backend/src/middlewares/validateRequest.js` (marca + JSDoc com `import('lib').Type`). **Verificador:** o Stop hook `typecheck-on-stop.sh`.

**Argumento esperado:** um diretório sob `backend/src` (ex.: `backend/src/middlewares`). Sem argumento, pergunte.

> Só **anota** — não muda lógica. O escopo do `tsc` é `backend/src` menos `migrations` (ver `backend/jsconfig.json`: `checkJs:false` + `strict:false`). Nunca marque migration nem nada fora de `backend/src`.

## Método

1. **Varrer** o diretório: liste os `.js` que **ainda não** têm `// @ts-check`. **Pule diretórios já marcados como excluídos** (ver "Evitar") — não rankeie nem proponha o que já foi avaliado e descartado.
2. **Rankear candidatos** pela heurística abaixo e **apresentar a lista com justificativa** — pare pro meu OK antes de editar (act-with-approval).
3. **Anotar** cada arquivo aprovado: `// @ts-check` na linha 1 + o JSDoc mínimo pra tipar params/returns e as **fronteiras de lib** (`import('yup').Schema`, `import('express').RequestHandler`, `import('sequelize')...`). Mudança mínima, sem refatorar.
4. **Fechar verde:** garanta que o `tsc` passa (o Stop hook roda `tsc -p backend/jsconfig.json` no fim do turno). Tipo quebrado que você introduziu = corrigir antes de encerrar.

## Bons candidatos (payoff alto)

- **Fronteira de lib / contrato claro:** middlewares, utils, services, helpers — onde `import('lib').Type` no JSDoc já rende (ex.: `validateRequest.js` com yup+express).
- Arquivos que **já têm JSDoc** ou assinatura simples e estável.
- **Fundacionais / baixa rotatividade** — mudam pouco, então a anotação não envelhece.

## Evitar (payoff baixo)

- Arquivos voláteis, ou que exigiriam JSDoc pesado por pouco ganho.
- Controllers gordos com muitos caminhos — comece pelos utils/middlewares que eles consomem.
- Migrations (já excluídas no `jsconfig`) e qualquer coisa fora de `backend/src`.

### Excluído — não reavaliar

- **`backend/src/models/` (os 15 models Sequelize)** — avaliado em 2026-07-02, **custo alto, não anotar**. Os models sobrescrevem `static init(sequelize)` com assinatura incompatível com `Model.init` → cascata de `TS2417` (static side) + `TS2684` (`this` não é `ModelStatic`) em todo `associate`, mais `TS2339` nos atributos de instância (`this.password_hash` etc.) e `TS2322` nas validações `{ msg }` sem `name`. Só fica verde com **supressão em massa** (`@ts-ignore` + casts `any`), o que anula o próprio `@ts-check` (payoff negativo). Tipagem real exigiria o padrão tipado do Sequelize v6 (`InferAttributes` + `declare`), que é **sintaxe só-TS** — em JS nativo o campo declarado sombreia o accessor em runtime. Logo depende de `.ts`/build (o projeto é ESM nativo sem build) ou `.d.ts` companheiros: **épico próprio, fora desta skill**. Não rankear os models de novo até essa decisão de stack mudar.
- **`backend/src/controllers/` (os 8 controllers)** — avaliado em 2026-07-02, **baixo payoff, não anotar** (retorno decrescente, não impossível). As duas maiores superfícies de um controller são `any` neste projeto: `req`/`res` (não dá pra tipar como `express.Request` sem brigar com `req.userId`/`req.userPermissions` do `loginRequired`) e as instâncias de model (cast `any` pelo override de `static init`). Logo o `@ts-check` vira **"green theater"** — passa, mas quase não checa a lógica de risco (query, projeção, handleErrors operam em `any`); o único ganho é `Sequelize.ValidationError` no `instanceof`, e o custo é **cast por chamada em cada call de model** (ruído que multiplica nos CRUD gordos de 300–550 linhas). O território de alto valor (fronteiras de lib: yup/pino/rate-limit/express nos middlewares+config+schemas) **já está coberto**. Testados e revertidos por decisão: `HomeController` (marker-only) e `AccessLevelController` (1 cast). Reabrir só se `req`/model deixarem de ser `any` (ex.: tipar as extensões de `Request`, ou os models virarem `.ts`).
- **`backend/src/routes/` — PARCIAL, não é exclusão por payoff.** Avaliado em 2026-07-02: **5 adotados** (`accessLevelRoutes`, `homeRoutes`, `studentRoutes`, `tokenRoutes`, `userRoutes`) com o fix `const router = Router()` (sem `new` — ver "Padrão de anotação"). **3 bloqueados por BUG real** (não por payoff): `avatarRoutes`, `guardianRoutes`, `staffRoutes` chamam `roleAuth` na forma legada numérica (`roleAuth([4])`, `roleAuth(1, 2, 3)`), incompatível com o `roleAuth` flag-based atual → `TS2345`/`TS2554`, e em runtime é **403 sempre** (a "rotas quebradas" da pendência backend). **Não mascarar com cast** — adotam `@ts-check` assim que o `roleAuth` for corrigido pra string flag (`manage_*`), que é decisão de auth/HITL.

## Padrão de anotação

```js
// @ts-check
/**
 * @param {import('yup').Schema} schema
 * @returns {import('express').RequestHandler}
 */
export const validateRequest = (schema) => async (req, res, next) => { /* ... */ };
```

### Fix recorrente: `new X()` que o type não declara como construtível

Quando o `tsc` acusa `TS2350`/`TS2351` ("not constructable" / "only a void function...") mas o runtime aceita `new` (gap types-vs-runtime):

- **Se existe forma canônica sem `new`, prefira-a** — ex.: Express `const router = Router();` (não `new Router()`). Mantém `router` **tipado** (checa os handlers), sem cast, sem vazar `any`. É mudança de 1 token, comportamento idêntico.
- **Só casta quando `new` é obrigatório** (classe real que precisa de instância) — ex.: Sequelize `const connection = new (/** @type {any} */ (Sequelize))(config);`. Aqui não há forma sem `new`, então o cast `any` é o fallback (aceitando que a instância vira `any`).

## Regras obrigatórias

- `// @ts-check` **na linha 1**, antes de qualquer JSDoc/import.
- **Só anotar:** não alterar comportamento, assinatura ou nomes.
- **JSDoc mínimo** pra passar: tipe o que o `tsc` exige (params, returns, fronteiras de lib). Não sobre-anote — `strict:false`, então `catch (e)` fica `any`, sem cerimônia.
- **Lote pequeno sob aprovação:** rankear e mostrar antes de editar; não marcar o diretório inteiro sem meu OK.
- **Comentários em pt-br; identificadores e tipos em inglês.**

> Par **fazer → checar**: a skill adiciona a marca; o hook **`typecheck-on-stop.sh`** (Stop) roda `tsc --noEmit` sobre todos os `// @ts-check` no fim do turno e segura o encerramento se algum tipo quebrar. Não há agente revisor — o verificador é o hook, determinístico.

> **Ideia futura (não implementada):** modo **"reparo"** — dado o output do `tsc`/hook, aplicar o fix mínimo num arquivo que **já** tem `// @ts-check` (sem re-rankear, sem adotar novos). Hoje a correção fica no **loop principal, sob controle total do humano** — decisão consciente de *não* automatizar (o valor está no julgamento caso a caso: cast-mínimo vs. anotação-real vs. excluir o arquivo). Squiggle só existe em arquivo já optado (`checkJs:false`), então o ciclo hook→correção já é fechado; um agente dedicado seria redundante e empurraria pro rabbit-hole de `any`.
