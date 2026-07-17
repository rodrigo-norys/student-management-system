# 🎓 Student Management System

> Aplicação Full Stack de gestão escolar **multi-unidade**, arquitetada sobre um schema de 5 Tiers. A fundação — autenticação com RBAC, testes automatizados, CI e deploy em produção — está entregue; o núcleo acadêmico (turmas → notas → frequência) está em construção sobre um modelo de dados que já prevê o produto completo.

![Badge Status](https://img.shields.io/static/v1?label=STATUS&message=EM%20PRODU%C3%87%C3%83O&color=success&style=for-the-badge)
![Badge Node](https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=node.js)
![Badge React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Badge Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Badge DB](https://img.shields.io/badge/MariaDB-10.11-003545?style=for-the-badge&logo=mariadb&logoColor=white)

[![CI](https://github.com/rodrigo-norys/student-management-system/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/rodrigo-norys/student-management-system/actions/workflows/backend-tests.yml)

### 🔗 Acesso Rápido
- **Live Demo (read-only):** [sisbodeveloper.com.br](https://sisbodeveloper.com.br)
- **Schema Completo (DrawDB):** [Visualizar no navegador](https://drawdb.vercel.app/editor?shareId=a7577e72fc3ab1a93bfe9f09ab3c4b5c)

---

## 💻 Sobre o Projeto

O **Student Management System** é uma aplicação Full Stack em desenvolvimento contínuo, construída com a disciplina de um produto real — não de um exercício acadêmico.

A estratégia foi **fechar a fundação antes de escalar a superfície**: primeiro os atores do domínio (alunos, responsáveis, staff e usuários) com CRUD ponta a ponta, autenticação robusta e um schema que já modela todo o ciclo escolar; e só então o build-out do núcleo acadêmico (turmas → alocação → notas → frequência).

O diferencial técnico está na **modelagem de dados** (link acima): 16 tabelas em 5 camadas (Tiers), com `units` + `staff_units` declarando um sistema **multi-unidade** desde o schema — pronto para isolamento multi-tenant e histórico escolar evolutivo.

### ✨ Status das Funcionalidades

#### ✅ Implementado

**Autenticação & Autorização**
*   **🔐 Login seguro:** JWT em cookies HttpOnly + hashing com Bcrypt.
*   **🛡️ Controle de Acesso (RBAC):** `access_levels` com *flags* de permissão (`manage_account`, `manage_record`, `manage_academic`, `manage_finance`) e **peso hierárquico** validado no controller. Toda rota protegida passa por `loginRequired` + `roleAuth(flag)`.
*   **👁️ Modo Demo read-only:** acesso público de demonstração que bloqueia qualquer escrita num *choke-point* único no backend.

**Atores do Domínio (CRUD ponta a ponta)**
*   **👨‍🎓 Alunos, Responsáveis, Staff e Usuários:** cadastro, edição, listagem paginada e *soft-delete* via ENUM `status`.
*   **🖼️ Avatar:** upload e vinculação de foto de perfil, com política de autorização por recurso.
*   **📍 Múltiplos Endereços:** até 3 por aluno, com busca automática por CEP (BrasilAPI) e sincronização (Create/Update/Delete) em **transação atômica** no Sequelize.

**Qualidade & Infraestrutura**
*   **🧪 Testes automatizados:** 134 testes (Vitest + Supertest) contra um banco MariaDB **real**, cobrindo a espinha de segurança (auth, permissões por *flag*, *demo trap*, peso hierárquico).
*   **🔄 Integração Contínua (CI):** GitHub Actions em cada PR — backend (lint + testes contra MariaDB) e frontend (lint + build).
*   **⚙️ Gerenciamento de Estado:** Redux + Redux-Saga para *side-effects* (atores globais); hooks locais no módulo de Usuários.
*   **🗄️ Versionamento de Banco:** migrações Sequelize versionadas e auditáveis.

#### 🚧 Modelado / Em construção (núcleo acadêmico — Tiers 3–5)

O schema já modela; a próxima fase entrega a superfície HTTP + UI:
*   **🏢 Lotação de Staff:** professores × unidades (`staff_units`, N:N) — base do isolamento multi-unidade.
*   **📚 Turmas & Disciplinas:** `unit_classes`, `subjects`.
*   **📅 Alocação (Grade):** cruzamento exato Professor × Turma × Disciplina (`class_allocations`).
*   **📊 Notas & Frequência:** `student_grades` e `attendances`, vinculadas à alocação da aula (histórico segmentado por período).
*   **👪 Rede de Responsáveis:** `student_guardians`, com *flag* específica para o responsável financeiro.

---

## 🗄️ Arquitetura de Dados

16 tabelas em **5 Tiers**, seguindo **normalização** e **integridade referencial** (Foreign Keys e Constraints), do acesso base aos resultados acadêmicos:

1. **Acesso & Base** — `access_levels`, `units`, `subjects`
2. **Atores** — `users`, `staff`, `students`, `guardians`, `addresses`
3. **Estrutura & Vínculos** — `unit_classes`, `staff_units`, `student_guardians`
4. **Operações** — `class_allocations`, `student_classes`
5. **Resultados** — `student_grades`, `attendances`

---

## 🧪 Testes & Qualidade

- **134 testes** (Vitest + Supertest) rodando contra o `school_test` — **MariaDB real, nunca SQLite**.
- Cobrem os *guards* de segurança: autenticação, `roleAuth` por *flag*, modo demo read-only, peso hierárquico e política de exclusão.
- **CI** (GitHub Actions) em todo PR para `main`:
  - **Backend:** lint → format → typecheck → migrations → testes (contra service `mariadb:10.11`).
  - **Frontend:** lint → format → build (Vite).

```bash
npm test --prefix backend    # roda a suíte de testes
```

---

## 🚀 Infraestrutura & Deploy

Diferente de projetos acadêmicos comuns, esta aplicação roda em um ambiente de **produção real** (VPS), aplicando conceitos de DevOps e administração de servidores:

- **Servidor:** VPS Linux (Ubuntu).
- **Borda / Reverse Proxy:** **Caddy** com **HTTPS automático** (ACME/Let's Encrypt — renovação sem intervenção).
- **Orquestração:** Docker Compose com **rede segmentada** (banco isolado, sem rota externa), *hardening* CIS e imagens fixadas por *digest*.
- **Banco:** MariaDB 10.11 — **mesma engine em dev e prod** —, com usuário de aplicação de privilégio mínimo, **backup automatizado + restore testado**.

---

## 🔧 Como Rodar Localmente

### Pré-requisitos
* **Node.js:** 22+ (LTS — ver `.nvmrc`)
* **Banco de Dados:** MariaDB 10.11 — localmente sobe via Docker (imagem `mariadb:10.11`, idêntica à de produção)

### 1. Clone o repositório
```bash
git clone https://github.com/rodrigo-norys/student-management-system.git
cd student-management-system
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
# preencha: conexão do banco, ACCESS_TOKEN_SECRET, CORS_ORIGINS e usuário demo
```

### 3. Backend
```bash
cd backend
npm install
npm run dev        # API com nodemon (src/server.js)
```

### 4. Frontend
```bash
cd frontend
npm install
npm start          # dev server (Vite)
```

> O ambiente completo (Docker Compose + Caddy + domínios `*.localhost`) está descrito em `docs/infra/`.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Node.js 22, Express, Sequelize ORM (ESM), JWT (cookies HttpOnly), Bcrypt.
* **Frontend:** React 19, Vite, Redux + Redux-Saga, Styled Components, Axios.
* **Banco de Dados:** MariaDB 10.11 (via driver `mysql2`).
* **Testes:** Vitest + Supertest.
* **CI / Infra:** GitHub Actions, Docker, Caddy, Linux.

---

## 📂 Estrutura do Projeto
```bash
student-management-system/
├── backend/            # API Node.js — models, controllers, rotas, migrations, testes
├── frontend/           # SPA React (Vite) — páginas, store, UI Kit
├── docs/               # Roadmap, diagramas do banco e infra
└── .github/workflows/  # CI (backend + frontend)
```

---

**Desenvolvido por Rodrigo Norys**

[LinkedIn](https://linkedin.com/in/rodrigo-norys) | [Portfólio](https://sisbodeveloper.com.br)
