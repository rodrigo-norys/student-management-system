---
name: criar-rota
description: Cria um novo arquivo de rotas Express seguindo a estrutura de userRoutes. Use ao expor um controller via HTTP. Cobre loginRequired, roleAuth(flag), validateRequest, a ordem de declaração (estáticas antes de /:id) e o registro do router em app.js.
---

# Criar rota

Gera `backend/src/routes/<entity>Routes.js`. **Base estrutural:** `userRoutes.js`.

**Argumento esperado:** a entidade (ex.: `subject`, `unit`). Sem argumento, pergunte.

## Estrutura canônica
```js
import { Router } from 'express';
import <entity>Controller from '../controllers/<Entity>Controller.js';
import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';
// só quando há validação de body:
import { validateRequest } from '../middlewares/validateRequest.js';
import { <entity>ValidationSchema } from '../schemas/<entity>Schema.js';

const router = new Router();

router.use(loginRequired);

// 1) Rotas estáticas/específicas ANTES das paramétricas
router.put('/setup-password', validateRequest(<entity>ValidationSchema), <entity>Controller.setupPassword);
router.get('/search-targets', roleAuth('manage_account'), <entity>Controller.searchTargets);

// 2) CRUD
router.post('/',      roleAuth('<flag>'), <entity>Controller.create);
router.get('/',       roleAuth('<flag>'), <entity>Controller.index);
router.get('/:id',    <entity>Controller.show);
router.put('/:id',    roleAuth('<flag>'), <entity>Controller.update);
router.delete('/:id', roleAuth('<flag>'), <entity>Controller.delete);

export default router;
```

## Regras
- **`router.use(loginRequired)` no topo** — autentica tudo abaixo e popula `req.userId`/`userWeight`/`userRole`/`userPermissions`.
- **Ordem importa**: Express casa na ordem de declaração. Rota estática (`/search-targets`) tem que vir **antes** de `/:id`, senão `:id` captura `"search-targets"`.
- **`roleAuth('flag')` por rota mutante.** Escolha a flag pelo domínio:
  - `manage_account` — usuários/contas/acesso
  - `manage_record` — cadastros (students, guardians, staff)
  - `manage_academic` — turmas, alocações, notas
  - `manage_finance` — financeiro
- **`show` (`/:id`) costuma ficar só com `loginRequired`** (leitura aberta a logados) — confirme se faz sentido pro domínio e espelhe as rotas irmãs.
- **`validateRequest(schema)` antes do controller** em rotas com body; schema em `src/schemas/`.
- **Peso hierárquico NÃO vai na rota.** `roleAuth` só checa a flag de permissão; a validação de `req.userWeight` (mexer em ator de peso maior/igual) é **dentro do controller**.
- **Registrar o router**: monte em `app.js` seguindo o padrão das rotas já registradas (mesmo prefixo REST da entidade).

> Após gerar, sugira passar no agente `backend-auth-review`.
