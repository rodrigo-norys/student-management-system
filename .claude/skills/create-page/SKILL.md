---
name: create-page
description: Cria uma nova página/módulo no frontend React. Primeiro DECIDE entre contexto LOCAL (hooks, módulo isolado — padrão User) e GLOBAL (redux-sagas, entidade cross-app — padrão Student) usando o modelo de dados do CLAUDE.md, depois segue a estrutura correspondente. Cobre store, hooks, components e a fachada styled.js.
---

# Criar página

Gera uma página/módulo em `frontend/src/pages/`. A primeira decisão define toda a arquitetura — não pule.

**Argumento esperado:** a entidade (ex.: `Subject`, `Unit`). Sem argumento, pergunte.

## Passo 1 — Decidir: LOCAL ou GLOBAL

Pergunta central: **o estado dessa entidade é necessário em todo o app / por vários módulos, ou só enquanto a tela dela está aberta?**

| | LOCAL (hooks) | GLOBAL (redux-sagas) |
|---|---|---|
| Quando | Módulo administrativo, isolado, trabalhado só quando aberto | Entidade central, consumida por vários módulos, estado compartilhado/persistido |
| Exemplo | `User` (UserManagement) | `Student` |
| Estado | `useState` + hooks locais, efêmero | Redux store, sobrevive à navegação |

Cruze com o **modelo de dados do `CLAUDE.md`**: entidade muito referenciada por outras tabelas/tiers (como `students` — referenciada por `student_guardians`, `student_classes`, `addresses`, `student_grades`) tende a **global**; tela administrativa autocontida tende a **local**. **Na dúvida, pergunte ao usuário** antes de gerar.

## Passo 2A — Estrutura LOCAL (base: `pages/User/UserManagement/`)

```
pages/<Module>/
  index.js          // orquestra: useState (modais/seleção) + consome hooks + render
  styled.js         // fachada: reexporta components/ui + específico local
  constants.js      // ITEMS_PER_PAGE, configs da tela
  components/       // toolbar, views, modais
  hooks/
    use<Entity>Data.js     // leitura: axios GET, paginação, loading, debounce de busca
    use<Entity>Actions.js  // mutações: save/validate, recebe setters do index
    useDebounce.js
```
- `index.js` segura só o estado de UI (modais, item selecionado) com `useState`; dados e ações vêm dos hooks.
- `use<Entity>Data`: `useEffect` + `axios` de `services/axios`; retorna `dataList/loading/currentPage/totalPages` + handlers de paginação/aba; usa `useDebounce` no termo de busca.
- **Sem footprint no store global.**

## Passo 2B — Estrutura GLOBAL (base: `store/modules/student/` + página)

Crie o módulo do store:
```
store/modules/<entity>/
  types.js     // CREATE_<E>_REQUEST/SUCCESS/FAILURE, GET_<E>S_..., UPDATE_..., DELETE_...
  actions.js   // create<E>Request/Success/Failure, get<E>sRequest..., etc.
  reducer.js   // initialState { <e>s:[], isLoading:false }; REQUEST→loading, SUCCESS→dados, FAILURE→stop
  sagas.js     // takeLatest(types.X_REQUEST, worker); worker: call(axios) → put(success/failure) + toast + history.push
```
Fie no root (passo fácil de esquecer):
- `rootReducer.js`: `import <entity> from './<entity>/reducer'` + incluir em `combineReducers({...})`.
- `rootSaga.js`: `import <entity> from './<entity>/sagas.js'` + incluir no `all([...])`.

Página (`pages/<Entity>/...`): `useDispatch` para disparar `actions.<x>Request`, `useSelector` para ler do store. Mesma fachada `styled.js`.

### Convenções do padrão global (de student)
- Tipos em `SCREAMING_SNAKE`, ciclo REQUEST/SUCCESS/FAILURE por operação.
- Actions: `<verbo><Entity>Request/Success/Failure(payload)`.
- Saga: `try` → dispara `success` + `toast.success` + `history.push`; `catch` → extrai `get(e, 'response.data.errors', [])`, `toast.error` por erro e `put(failure)`.
- Reducer agrupa os REQUEST (→ `isLoading:true`) e os FAILURE (→ `isLoading:false`); SUCCESS atualiza a lista.

## Comum aos dois
- **Fachada `styled.js`**: reexporta primitivos de `components/ui`, define localmente só o específico da página (mesma convenção que o agente `ui-kit-review` valida).
- `constants.js` para constantes da tela.
- **Comentários pt-br, identificadores em inglês.**
- HTTP via `axios` de `services/axios`; erros via `toast` + `get(e, 'response.data.errors')`.
- `CI=true npm run build` trata warning como erro — rode antes de considerar pronto.

> Após gerar, sugira passar no agente `ui-kit-review`.
