---
name: create-test
description: Cria testes vitest+supertest para o backend, seguindo o setup existente (vitest.config.js + app exportado sem listen). Use para a suíte de guards (loginRequired, roleAuth por flag, demo trap, peso hierárquico) e, depois, integração CRUD/DB. Roda contra o banco school_test real (nunca SQLite). Sem argumento, pergunte o alvo.
---

# Criar teste

Gera testes em `backend/` com **vitest + supertest**. **Base:** a convenção já existe em `backend/test/` (suítes `*.test.js` + `helpers/db.js` e `helpers/auth.js`) — siga-a, não crie outra. A referência canônica é `test/auth.guards.test.js`. O app é exportado em `backend/src/app.js` (`export default new App().app`, sem `listen` — pronto pra supertest).

**Argumento esperado:** o alvo do teste (ex.: `guards`, `student-crud`, `auth-flow`). Sem argumento, pergunte o que vamos testar.

## Decisão de tipo (antes de escrever)

- **Guards / contrato** — `loginRequired`, `roleAuth` por flag, demo read-only trap, peso hierárquico, envelopes de erro/paginação. **Já coberto** por `test/auth.guards.test.js`, `delete.policy.test.js`, `avatar.policy.test.js`, `contract.test.js` — **estenda, não recrie**.
- **Integração CRUD/DB** — fluxo completo de escrita contra o banco. Ainda **descoberto** (é a lacuna viva). Exige `school_test` populado por **migrations** (nunca dump de prod, nunca SQLite — o dialect é `mysql`/MariaDB, ver `config/database.js`).

## Setup

- `backend/vitest.config.js` **já isola** a suíte: `NODE_ENV=test`, `LOG_LEVEL=silent`, `DATABASE=school_test`, `DEMO_LEVEL_ID`, `fileParallelism: false`. Leia o arquivo — os comentários explicam o porquê. **Não** crie `.env.test` (nada o carrega) nem toque em `config/database.js`.
- Supertest consome o app direto: `import app from '../src/app.js'` + `request(app)`. Sem subir servidor (`server.js` é quem dá `listen`).

## Estrutura canônica

Copie a forma de `test/auth.guards.test.js`: import de `'../src/app.js'`, fixtures e cookies de `test/helpers/db.js` (`setupTestData`/`teardownTestData`/`testUser`) e `test/helpers/auth.js` (`cookieFor`/`LEVELS`), com `beforeAll(setupTestData)` e `afterAll(teardownTestData → connection.close())`. Não recrie fixture local — os helpers já separam ator de alvo (ex.: `SECOND_DIRECTOR`), o que importa para a prova abaixo.

## Regras

- **Envelope nos asserts:** erro é `{ errors: [...] }` plural (o canônico). Se um endpoint devolver `{ error }` singular, o teste **documenta a divergência** — não a normalize escondido.
- **Prova de não-vacuidade (teste de guarda):** verde não prova que o teste cobre. Neutralize a guarda na **fonte** (o `return`/`throw` dela vira no-op) e rode — o teste-alvo **tem que ficar vermelho**. Se seguir verde, está preso a outro mecanismo (o ator passa pelo **peso** e não pela guarda; ou o **self-guard** dispara antes): corrija o **teste**, não a guarda. Restaure com `git checkout -- <arquivo>`, nunca reescrevendo à mão — guarda neutralizada esquecida no código é pior que teste vácuo.
- **Comentários em pt-br, identificadores em inglês.** Em teste, o comentário que se justifica é
  o que explica **por que aquele caso existe** ou **o que quebra sem ele** — sem ele, alguém
  remove o teste achando que é redundante (ex.: a âncora positiva de uma matriz de flags).
  Descrever o que o `expect` já diz é ruído. Sem narrativa; impessoal e atemporal.
- Nome do arquivo: `backend/test/<alvo>.test.js` (flat, junto das suítes existentes — ex.: `delete.policy.test.js`).

> O ciclo desta skill fecha no **gate `npm test`** (`vitest run`) **mais a prova de não-vacuidade** — teste é verificado **rodando**, não revisado. Rode `npm test` em `backend/`. A lógica de autorização que os testes cobrem tem o `backend-auth-review` como revisor de par.
