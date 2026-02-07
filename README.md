# 🎓 Student Management System

> Um sistema completo para gestão escolar, focado em controle acadêmico, enturmação e lançamento de notas.

![Badge em Desenvolvimento](https://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=ORANGE&style=for-the-badge)
[![Badge MVP](https://img.shields.io/static/v1?label=MVP&message=ONLINE&color=GREEN&style=for-the-badge)](https://sisbodeveloper.com.br/)

![Badge Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Badge React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Badge MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

## 💻 Sobre o Projeto

Este projeto é uma aplicação Full Stack desenvolvida para gerenciar o fluxo de dados de uma instituição de ensino. O objetivo é resolver o problema de integridade de dados entre matrículas, notas e histórico escolar.

O sistema permite o cadastro de alunos, gestão de turmas, alocação de professores (grade horária) e o processamento de aprovação/reprovação automática com base nas notas lançadas.

## 🗄️ Modelagem do Banco de Dados (EM DESEMVOLVIMENTO...)

O banco de dados foi projetado  para garantir a integridade e evitar redundâncias.

Abaixo, o Diagrama Entidade-Relacionamento (DER) utilizado:

<div align="center">
  <img src="./docs/database/school_diagram.png" alt="Diagrama do Banco de Dados" width="800">
</div>

> **Nota Técnica:** O arquivo editável do MySQL Workbench (`.mwb`) está disponível na pasta [`/docs/database`](./docs/database).

### Principais Decisões de Arquitetura:
* **Separação de Responsabilidades:** Dados de acesso (`users`) separados de dados de perfil (`students`, `staff`).
* **Histórico Acadêmico:** Tabela `student_grades` atua como pivô, conectando o aluno à aula específica e registrando o desempenho individual.
* **Grade Horária Flexível:** A tabela `class_schedules` permite que múltiplos professores lecionem diferentes matérias na mesma turma (relação N:N).

## ✨ Funcionalidades

- **Autenticação** (Login)
- **Autorização** (Níveis de Acesso)
- **Gestão de Pessoas** (Alunos, Professores e Staff)
- **Enturmação** (Matrícula de alunos em turmas anuais)
- **Grade Horária** (Atribuição de professores a matérias)
- **Boletim** (Lançamento de notas e cálculo de média)
- **Relatórios** (Listas de presença e histórico)

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** & **Express**
- **Sequelize ORM** (Gestão do SQL)
- **MySQL** (Banco de Dados)
- **JWT** (Autenticação)

### Frontend
- **React.js**
- **Axios** (Consumo de API)
- **CSS Modules / Styled Components**

## 📂 Estrutura do Projeto

```bash
student-management-system/
├── backend/         # API Node.js, Models e Controllers
├── frontend/        # Aplicação React
└── docs/            # Documentação e Diagramas do Banco