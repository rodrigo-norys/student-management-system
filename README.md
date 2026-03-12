# 🎓 Student Management System

> MVP de um sistema para gestão acadêmica, focado na validação da arquitetura de dados e fluxo de notas.

![Badge Status](https://img.shields.io/static/v1?label=STATUS&message=MVP%20ONLINE&color=GREEN&style=for-the-badge)
![Badge Node](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)
![Badge React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Badge DB](https://img.shields.io/badge/MariaDB-10.11-003545?style=for-the-badge&logo=mariadb&logoColor=white)

### 🔗 Acesso Rápido
- **Live Demo (Aplicação Rodando):** [sisbodeveloper.com.br](https://sisbodeveloper.com.br)
- **Visão Futura (Schema Completo):** [Visualizar no DrawDB](https://drawdb.vercel.app/editor?shareId=a7577e72fc3ab1a93bfe9f09ab3c4b5c)

---

## 💻 Sobre o Projeto

O **Student Management System** é uma aplicação Full Stack em desenvolvimento contínuo. Atualmente em fase de **MVP (Minimum Viable Product)**, o projeto foca em validar as regras de negócio essenciais: cadastro, enturmação e lançamento de notas.

O grande diferencial técnico reside na **Modelagem do Banco de Dados** (disponível no link acima). Embora a aplicação atual implemente o fluxo básico, o banco já foi arquitetado suportar funcionalidades complexas futuras, como multi-tenancy e histórico escolar evolutivo, demonstrando planejamento de longo prazo.

### ✨ Status das Funcionalidades

#### ✅ Implementado (MVP Atual)
- **Autenticação Base:** Estrutura de usuários (`users`) pronta e integrada para login seguro.
- **Gestão Discente:** Tabela de Alunos (`students`) funcional, permitindo cadastro e persistência de dados.
- **Endereços Múltiplos:** Relacionamento dinâmico permitindo até 3 endereços por aluno. Sincronização inteligente no backend (Update/Create/Delete) operando dentro de transações atômicas no Sequelize.
- **Integração de API Externa:** Busca automática de logradouro via CEP (BrasilAPI) com preenchimento dinâmico e integrado ao estado global do formulário.
- **Gerenciamento de Estado Global:** Arquitetura consolidada utilizando Redux e Redux Saga para controle de side-effects e chamadas assíncronas (Axios).
- **Validação e Higienização de Dados:** Validação declarativa no frontend (máscaras de CPF, e-mail, campos obrigatórios) antes da persistência, garantindo a integridade do banco de dados.
- **Gestão de Mídia:** Upload e vinculação de foto de perfil (Avatar) diretamente ao cadastro do aluno.
- **Versionamento de Banco:** Controle de migrações ativo e auditável via `sequelizemeta`.

#### 🚧 Em Desenvolvimento / Modelado
- **Controle de Acesso (RBAC):** Tabela `access_levels` com flags booleanas (`manage_account`, `manage_finance`) para permissões granulares.
- **Gestão de Staff:** Vínculo de professores a múltiplas unidades escolares via tabela pivô `staff_units` (N:N).
- **Rede de Responsáveis:** Relacionamento entre alunos e responsáveis (`student_guardians`) com flag de responsabilidade financeira.
- **Grade Horária (Alocação):** Tabela `class_allocations` modelada para cruzar Professor, Turma e Disciplina (`subjects`).
- **Sistema de Avaliação:** Estrutura de notas (`student_grades`) vinculada à alocação da aula, permitindo histórico detalhado por bimestre.


## 📸 Screenshots

| Login | Dashboard |
|:---:|:---:|
| <img src="./docs/screenshots/login.png" width="400" alt="Tela de Login"> | <img src="./docs/screenshots/dashboard.png" width="400" alt="Dashboard"> |

---

## 🗄️ Arquitetura de Dados
A modelagem do banco de dados segue rigorosos princípios de **normalização** e **integridade referencial** (Foreign Keys e Constraints), dividida em 4 camadas lógicas para facilitar a manutenção e escalabilidade.

### 🗺️ Visualização Interativa
Visualize a estrutura completa, relacionamentos e tipos de dados diretamente no navegador via DrawDB:

[![Ver Schema no DrawDB](https://img.shields.io/badge/VER_SCHEMA_COMPLETO-DrawDB-blue?style=for-the-badge&logo=database)](https://drawdb.vercel.app/editor?shareId=a7577e72fc3ab1a93bfe9f09ab3c4b5c)

> **Backup:** </br>
> O arquivo JSON da estrutura também está disponível em [`docs/database/school_schema.json`](./docs/database/school_schema.json).</br>
> O arquivo SQL da estrutura também está disponível em [`docs/database/init.sql`](./docs/database/init.sql).

### Diagrama Simplificado (Mermaid)
```mermaid
erDiagram
    %% 1. A ORIGEM DO SISTEMA 
    ACCESS_LEVELS ||--|{ USERS : "access_level_id"
    SUBJECTS ||--|{ CLASS_ALLOCATIONS : "subjects_id"

    %% 2. USERS -> ATORES
    USERS ||--|| STUDENTS : "user_id"
    USERS ||--|| STAFF : "user_id"
    USERS ||--|| GUARDIANS : "user_id"

    %% 3. ATORES -> ENDEREÇOS
    STUDENTS ||--|{ ADDRESSES : "student_id"
    STAFF ||--|{ ADDRESSES : "staff_id"
    GUARDIANS ||--|{ ADDRESSES : "guardian_id"
    UNITS ||--|| ADDRESSES : "unit_id"

    %% 4. RELAÇÕES DE UNIDADE E STAFF
    UNITS ||--|{ UNIT_CLASSES : "unit_id"
    UNITS ||--|{ STAFF_UNITS : "unit_id"
    STAFF ||--|{ STAFF_UNITS : "staff_id"

    %% 5. VÍNCULOS FAMILIARES
    STUDENTS ||--|{ STUDENT_GUARDIANS : "student_id"
    GUARDIANS ||--|{ STUDENT_GUARDIANS : "guardian_id"

    %% 6. SALA DE AULA 
    STUDENTS ||--|{ STUDENT_CLASSES : "student_id"
    UNIT_CLASSES ||--|{ STUDENT_CLASSES : "unit_class_id"
    
    STAFF ||--|{ CLASS_ALLOCATIONS : "staff_id"
    UNIT_CLASSES ||--|{ CLASS_ALLOCATIONS : "unit_class_id"

    %% 7. O FIM DO FLUXO 
    STUDENT_CLASSES ||--|{ STUDENT_GRADES : "student_classes_id"
    CLASS_ALLOCATIONS ||--|{ STUDENT_GRADES : "class_allocation_id"
```
## 🚀 Infraestrutura & Deploy
Diferente de projetos acadêmicos comuns, esta aplicação está hospedada em um ambiente de produção real (VPS), aplicando conceitos de DevOps e administração de servidores:

- **Servidor** : VPS Linux (Ubuntu/CentOS).
- **Web Server** : Nginx configurado como Reverse Proxy.
- **Gerenciamento de Processos** : Docker (Restart Policy).
- **Segurança** : SSL/TLS (HTTPS) via Certbot.

Aqui está o trecho formatado com a sintaxe correta de Markdown (código, negrito e links) para você copiar e colar:

## 🔧 Como Rodar Localmente

## Pré-requisitos
* **Node.js:** v20+ (Recomendado v20.20.0 ou superior)
* **Banco de Dados:** MariaDB 10.11


### 1. Clone o repositório
```bash
git clone [https://github.com/rodrigo-norys/student-management-system.git](https://github.com/rodrigo-norys/student-management-system.git)
cd student-management-system
```

### 2. Configuração do Backend

```bash
cd backend
npm install
# Crie um arquivo .env na raiz do backend com suas credenciais do DB
# Exemplo: DB_HOST=localhost, DB_USER=root, DB_PASS=senha
npm start
```

### 3. Configuração do Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Tecnologias Utilizadas
* **Backend:** Node.js, Express, Sequelize ORM, JWT, Bcrypt.
* **Frontend:** React.js, Axios, Styled Components / CSS Modules.
* **Banco de Dados:** MySQL.
* **Infra:** Nginx, Docker, Linux.



## 📂 Estrutura do Projeto
```bash
student-management-system/
├── backend/         # API Node.js, Models e Controllers
├── frontend/        # Aplicação React
└── docs/            # Documentação e Diagramas do Banco
```
---

**Desenvolvido por Rodrigo Norys**




[LinkedIn](https://linkedin.com/in/rodrigo-norys) | [Portfólio](https://sisbodeveloper.com.br)