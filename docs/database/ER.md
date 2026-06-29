# Diagrama ER — Student Management System

> Fonte: `information_schema` do banco **vivo** (`school_local`, MariaDB 10.11 local =
> espelho de produção). Reflete o estado **pós-auditoria de dados** (migrations de schema +
> alinhamento dos models): FKs de `addresses` materializadas, `students.user_id`
> (SET NULL + UNIQUE), `photos` removida, defaults de timestamp padronizados e ordem de
> colunas alinhada aos models. A ordem dos atributos segue `backend/src/models/`.

## Legenda

- **Linha sólida (`--`)** = FK física real (constraint no schema; integridade garantida pelo banco).
- Cardinalidade: `||` exatamente-um · `o|` zero-ou-um · `o{` zero-ou-muitos.
- Rótulo: coluna FK + regra `ON DELETE` efetiva (`CASCADE` / `SET NULL`).

## Diagrama

```mermaid
erDiagram
    access_levels ||--o{ users : "access_level_id · SET NULL"

    users ||--o| staff : "user_id · UNIQUE · SET NULL"
    users ||--o| guardians : "user_id · UNIQUE · SET NULL"
    users ||--o| students : "user_id · UNIQUE · SET NULL"

    students ||--o{ addresses : "student_id · CASCADE"
    guardians ||--o{ addresses : "guardian_id · CASCADE"
    staff ||--o{ addresses : "staff_id · CASCADE"
    units ||--o| addresses : "unit_id · UNIQUE · CASCADE"

    units ||--o{ unit_classes : "unit_id · CASCADE"
    staff ||--o{ staff_units : "staff_id · CASCADE"
    units ||--o{ staff_units : "unit_id · CASCADE"
    students ||--o{ student_guardians : "student_id · CASCADE"
    guardians ||--o{ student_guardians : "guardian_id · CASCADE"

    staff ||--o{ class_allocations : "staff_id · CASCADE"
    unit_classes ||--o{ class_allocations : "unit_class_id · CASCADE"
    subjects ||--o{ class_allocations : "subject_id · CASCADE"
    students ||--o{ student_classes : "student_id · CASCADE"
    unit_classes ||--o{ student_classes : "unit_class_id · CASCADE"

    class_allocations ||--o{ student_grades : "class_allocation_id · CASCADE"
    student_classes ||--o{ student_grades : "student_classes_id · CASCADE"
    students ||--o{ attendances : "student_id · CASCADE"
    class_allocations ||--o{ attendances : "class_allocation_id · CASCADE"

    access_levels {
        int id PK
        varchar name UK
        varchar description
        int hierarchy_weight
        tinyint is_system_level "tinyint(4) — flag"
        tinyint manage_account
        tinyint manage_record
        tinyint manage_academic
        tinyint manage_finance
    }
    users {
        int id PK
        int access_level_id FK "nullable · SET NULL · fisicamente ultima coluna"
        varchar avatar_url
        varchar email UK
        varchar password_hash
        tinyint is_temporary "DEFAULT 1"
        enum status "5 valores"
    }
    units {
        int id PK
        varchar name UK
        varchar cnpj UK
        varchar email UK
        varchar phone
        enum status
    }
    subjects {
        int id PK
        varchar name UK
        varchar code UK
        text description
        varchar knowledge_area
        tinyint is_elective
        enum status
    }
    staff {
        int id PK
        int user_id FK "UNIQUE · SET NULL"
        varchar avatar_url
        varchar full_name
        varchar email UK
        varchar cpf UK
        date birth_date
        varchar phone "varchar(15)"
        varchar personal_email UK
        varchar job_title
        date hiring_date
        date termination_date
        varchar medical_notes
        enum status "4 valores"
    }
    students {
        int id PK
        int user_id FK "UNIQUE · SET NULL"
        varchar avatar_url "varchar(150)"
        varchar name
        varchar last_name
        varchar email
        varchar registration_number UK
        varchar cpf UK
        date birth_date
        varchar blood_type
        varchar medical_notes
        enum status "5 valores"
    }
    guardians {
        int id PK
        int user_id FK "UNIQUE · SET NULL"
        varchar avatar_url
        varchar name
        varchar last_name
        varchar cpf UK
        varchar phone "DEFAULT ''"
        varchar email UK
        enum status
    }
    addresses {
        int id PK
        varchar zip_code
        varchar street
        varchar number
        varchar complement
        varchar neighborhood
        varchar city
        char state "char(2) · model usa STRING(2)"
        int student_id FK "CASCADE"
        int guardian_id FK "CASCADE"
        int staff_id FK "CASCADE"
        int unit_id FK "UNIQUE · CASCADE"
    }
    unit_classes {
        int id PK
        int unit_id FK "CASCADE · FK so via associate"
        varchar name
        varchar grade_level
        varchar room_number
        varchar shift
        varchar school_year
        int max_students
        enum status
    }
    staff_units {
        int id PK
        int staff_id FK "CASCADE · FK so via associate"
        int unit_id FK "CASCADE · FK so via associate"
        enum status
    }
    student_guardians {
        int student_id PK_FK "CASCADE"
        int guardian_id PK_FK "CASCADE"
        varchar relationship_type
        tinyint is_financial_resp
        tinyint is_emergency_contact
        enum status
    }
    class_allocations {
        int id PK
        int staff_id FK "CASCADE · FK so via associate"
        int unit_class_id FK "CASCADE · FK so via associate"
        int subject_id FK "CASCADE · FK so via associate"
        enum status
    }
    student_classes {
        int id PK
        int student_id FK "CASCADE · FK so via associate"
        int unit_class_id FK "CASCADE · FK so via associate"
        date enrollment_date
        enum enrollment_status
        enum status "fisicamente entre created_at e updated_at"
    }
    student_grades {
        int id PK
        int class_allocation_id FK "CASCADE · FK so via associate"
        int student_classes_id FK "CASCADE · FK so via associate"
        decimal grade_1 "decimal(4,2)"
        decimal grade_2
        decimal grade_3
        decimal grade_4
        decimal final_average
        int absences
        enum subject_status
        enum status
    }
    attendances {
        int id PK
        int student_id FK "CASCADE · FK so via associate"
        int class_allocation_id FK "CASCADE · FK so via associate"
        date date
        enum attendance_status
        varchar notes
        enum status
    }
```

## FKs efetivas (22) — `referential_constraints` do banco vivo (pós-A/B/C)

| Tabela (filha) | Coluna | → Tabela (pai) | ON UPDATE | ON DELETE | Origem |
|---|---|---|---|---|---|
| users | access_level_id | access_levels | CASCADE | SET NULL | baseline |
| staff | user_id | users | CASCADE | SET NULL | baseline |
| guardians | user_id | users | CASCADE | SET NULL | baseline |
| students | user_id | users | CASCADE | **SET NULL** | **Migration B** (era CASCADE) |
| addresses | student_id | students | CASCADE | CASCADE | baseline |
| addresses | guardian_id | guardians | CASCADE | **CASCADE** | **Migration A** (nova) |
| addresses | staff_id | staff | CASCADE | **CASCADE** | **Migration A** (nova) |
| addresses | unit_id | units | CASCADE | **CASCADE** | **Migration A** (nova) |
| unit_classes | unit_id | units | CASCADE | CASCADE | baseline |
| staff_units | staff_id | staff | CASCADE | CASCADE | baseline |
| staff_units | unit_id | units | CASCADE | CASCADE | baseline |
| student_guardians | student_id | students | CASCADE | CASCADE | baseline |
| student_guardians | guardian_id | guardians | CASCADE | CASCADE | baseline |
| class_allocations | staff_id | staff | CASCADE | CASCADE | baseline |
| class_allocations | unit_class_id | unit_classes | CASCADE | CASCADE | baseline |
| class_allocations | subject_id | subjects | CASCADE | CASCADE | baseline |
| student_classes | student_id | students | CASCADE | CASCADE | baseline |
| student_classes | unit_class_id | unit_classes | CASCADE | CASCADE | baseline |
| student_grades | class_allocation_id | class_allocations | CASCADE | CASCADE | baseline |
| student_grades | student_classes_id | student_classes | CASCADE | CASCADE | baseline |
| attendances | student_id | students | CASCADE | CASCADE | baseline |
| attendances | class_allocation_id | class_allocations | CASCADE | CASCADE | baseline |

> **Resolvido na auditoria:** as 3 relações lógicas de `addresses` (`guardian_id`, `staff_id`,
> `unit_id`) que existiam **sem FK real** agora são constraints físicas (Migration A);
> `students.user_id` ganhou UNIQUE e passou a SET NULL (Migration B); a tabela `photos`
> (órfã do ORM) foi removida (Migration C).

## UNIQUE nas FKs 1:1 (paridade entre os atores)

| Coluna | Estado |
|---|---|
| `staff.user_id` | UNIQUE (baseline) |
| `guardians.user_id` | UNIQUE (baseline) |
| `students.user_id` | UNIQUE (**Migration B** — antes era índice não-único) |

## Ordem física (banco) × ordem dos models — alinhada

A ordem física das colunas **bate com a ordem declarada nos models** nas 15 tabelas. Os 6
models de junção/filhas passaram a declarar a FK no `init` (BX-3), e as 3 tabelas que ainda
divergiam fisicamente — `users`, `addresses`, `student_classes` — foram reordenadas no banco
pela **Migration I** (`MODIFY … AFTER`, preservando tipo/default/FKs). Verificado no local.
