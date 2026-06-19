---
name: create-test
description: Cria testes vitest+supertest para o backend, seguindo o setup existente (vitest.config.js + app exportado sem listen). Use para a suíte de guards (loginRequired, roleAuth por flag, demo trap, peso hierárquico) e, depois, integração CRUD/DB. Roda contra o banco school_test real (nunca SQLite). Sem argumento, pergunte o alvo.
---

# Criar teste

Gera testes em `backend/` com **vitest + supertest**. **Base:** ainda não há teste no repo — esta skill **bootstrapa a convenção** a partir de `backend/vitest.config.js` e do app exportado em `backend/src/app.js:75` (`export default new App().app`, sem `listen` — pronto pra supertest).

**Argumento esperado:** o alvo do teste (ex.: `guards`, `student-crud`, `auth-flow`). Sem argumento, pergunte o que vamos testar.

## Decisão de tipo (antes de escrever)

- **Guards / contrato** — `loginRequired`, `roleAuth` por flag, demo read-only trap, peso hierárquico, envelopes de erro/paginação. É a **primeira suíte** (roadmap Fase 1) e cobre exatamente os bugs críticos de auth.
- **Integração CRUD/DB** — fluxo completo contra o banco. Exige `school_test` populado por **migrations** (nunca dump de prod, nunca SQLite — o dialect é `mysql`/MariaDB, ver `config/database.js`).

## Setup (pré-requisito — confira antes de gerar)

- `vitest.config.js` fixa `NODE_ENV=test` e `LOG_LEVEL=silent`. **Mas** `config/database.js:30` faz `test` reusar o mesmo env de `development` (`DATABASE`, `DATABASE_USERNAME`…). Para isolar, aponte o env de teste a um banco **`school_test`** dedicado (via `.env.test`/bloco `env` do vitest) — **não** rode integração contra o banco de dev.
- Supertest consome o app direto: `import app from '../src/app.js'` + `request(app)`. Sem subir servidor (`server.js` é quem dá `listen`).

## Estrutura canônica (suíte de guards)

```js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('auth guards', () => {
  it('rejeita rota autenticada sem token → 401', async () => {
    const res = await request(app).get('/students');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('errors'); // envelope plural canônico
  });

  it('bloqueia mutação no nível demo (método ≠ GET) → 403', async () => {
    // login demo → cookie → POST cai no choke-point único de loginRequired
  });

  // roleAuth por flag (manage_record etc.), peso hierárquico (UserController), …
});
```

## Regras

- **Envelope nos asserts:** erro é `{ errors: [...] }` plural (o canônico). Se um endpoint devolver `{ error }` singular, o teste **documenta a divergência** — não a normalize escondido.
- **Sem banco para guards** quando der: teste o middleware/rota sem tocar dados reais. Integração com banco só na suíte CRUD, contra `school_test`.
- **Comentários em pt-br, identificadores em inglês.**
- Nome do arquivo: `<alvo>.test.js` próximo ao que testa (ex.: `src/middlewares/__tests__/`), ou em `backend/src/__tests__/`.

> O ciclo desta skill fecha no **gate `npm test`** (`vitest run`), não num agente — teste é verificado **rodando**, não revisado. Rode `npm test` em `backend/` (comando muta o ambiente de teste → pede permissão). A lógica de autorização que os testes cobrem tem o `backend-auth-review` como revisor de par.
