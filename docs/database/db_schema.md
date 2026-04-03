# school documentation
## Summary

- [Introduction](#introduction)
- [Database Type](#database-type)
- [Table Structure](#table-structure)
	- [access_levels](#access_levels)
	- [users](#users)
	- [addresses](#addresses)
	- [students](#students)
	- [guardians](#guardians)
	- [units](#units)
	- [unit_classes](#unit_classes)
	- [staff](#staff)
	- [subjects](#subjects)
	- [class_allocations](#class_allocations)
	- [student_guardians](#student_guardians)
	- [staff_units](#staff_units)
	- [student_classes](#student_classes)
	- [student_grades](#student_grades)
- [Relationships](#relationships)
- [Database Diagram](#database-diagram)

## Introduction

## Database type

- **Database system:** MySQL
## Table structure

### access_levels
 A coluna NAME agirá de forma mais abrangente. Deixando a tabela STAFF agir de forma mais precisa com a coluna job_title, com algo como Math professor.
| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement |  | |
| **name** | VARCHAR(30) | not null |  | |
| **description** | VARCHAR(150) | not null |  | |
| **manage_account** | TINYINT | not null |  | |
| **manage_record** | TINYINT | not null |  | |
| **manage_academic** | TINYINT | not null |  | |
| **manage_finance** | TINYINT | not null |  | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


### users

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement |  |FK to access access_levels |
| **access_level_id** | INTEGER | not null | fk_users_access_level_id_access_levels | |
| **avatar_url** | VARCHAR(255) | null |  | |
| **email** | VARCHAR(150) | not null, unique |  | |
| **password_hash** | VARCHAR(100) | not null |  | |
| **is_active** | TINYINT | not null, default: 1 |  | |
| **is_temporary** | TINYINT | not null, default: 1 |  |1 = to force change of password on first login |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| users_index_0 |  | email |
### addresses

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement |  | |
| **student_id** | INTEGER | null |  | |
| **guardian_id** | INTEGER | null |  | |
| **staff_id** | INTEGER | null |  | |
| **unit_id** | INTEGER | null, unique |  | |
| **zip_code** | VARCHAR(9) | not null |  | |
| **street** | VARCHAR(100) | not null |  | |
| **number** | VARCHAR(10) | not null |  | |
| **complement** | VARCHAR(100) | null, default: NULL |  | |
| **neighborhood** | VARCHAR(100) | not null |  | |
| **city** | VARCHAR(100) | not null |  | |
| **state** | CHAR(2) | not null |  | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| addresses_index_0 |  | zip_code |
### students

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement | fk_students_id_addresses | |
| **user_id** | INTEGER | null, unique | fk_students_user_id_users | |
| **avatar_url** | VARCHAR(150) | null |  | |
| **name** | VARCHAR(50) | not null |  | |
| **last_name** | VARCHAR(100) | not null |  | |
| **email** | VARCHAR(150) | not null |  | |
| **registration_number** | VARCHAR(20) | not null, unique |  | |
| **birth_date** | DATE | not null |  | |
| **cpf** | VARCHAR(14) | not null, unique |  | |
| **blood_type** | VARCHAR(3) | null |  | |
| **medical_notes** | VARCHAR(255) | null |  | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| students_index_0 |  | registration_number |
| students_index_1 |  | name, last_name |
### guardians

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement | fk_guardians_id_addresses | |
| **user_id** | INTEGER | null, unique | fk_guardians_user_id_users | |
| **avatar_url** | VARCHAR(150) | null |  | |
| **name** | VARCHAR(50) | not null |  | |
| **last_name** | VARCHAR(50) | not null |  | |
| **cpf** | VARCHAR(14) | not null, unique |  | |
| **phone** | VARCHAR(15) | not null |  | |
| **email** | VARCHAR(100) | not null, unique |  | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| guardians_index_0 |  | cpf |
| guardians_index_1 |  | name, last_name |
### units

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement | fk_units_id_addresses | |
| **name** | VARCHAR(50) | not null |  | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| units_index_0 |  | name |
### unit_classes

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement |  | |
| **unit_id** | INTEGER | not null | fk_unit_classes_unit_id_units | |
| **grade_level** | VARCHAR(50) | not null |  | |
| **room_number** | VARCHAR(20) | not null |  | |
| **shift** | VARCHAR(4) | not null |  | |
| **school_year** | VARCHAR(45) | not null |  | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| unit_classes_index_0 | ✅ | unit_id, room_number, shift, school_year |
| unit_classes_index_1 |  | grade_level |
### staff

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement | fk_staff_id_addresses | |
| **user_id** | INTEGER | null, unique | fk_staff_user_id_users | |
| **avatar_url** | VARCHAR(255) | null |  | |
| **full_name** | VARCHAR(150) | not null |  | |
| **email** | VARCHAR(150) | not null |  | |
| **cpf** | VARCHAR(14) | not null, unique |  | |
| **birth_date** | DATE | not null |  | |
| **phone** | VARCHAR(15) | not null |  | |
| **personal_email** | VARCHAR(100) | not null, unique |  | |
| **job_title** | VARCHAR(100) | not null |  | |
| **medical_notes** | VARCHAR(255) | null |  | |
| **hiring_date** | DATE | not null |  | |
| **status** | VARCHAR(20) | not null |  | |
| **is_active** | TINYINT | null |  | |
| **termination_date** | DATE | null |  | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| staff_index_0 |  |  |
### subjects

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement |  | |
| **name** | VARCHAR(50) | not null |  | |
| **code** | VARCHAR(10) | not null, unique |  | |
| **description** | TEXT(200) | null |  | |
| **knowledge_area** | VARCHAR(100) | null |  | |
| **is_elective** | TINYINT | not null |  | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| subjects_index_0 |  | name |
| subjects_index_1 |  | knowledge_area |
### class_allocations

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement |  | |
| **staff_id** | INTEGER | not null | fk_class_schedules_staff_id_staff | |
| **unit_class_id** | INTEGER | not null | fk_class_schedules_unit_class_id_unit_classes | |
| **subjects_id** | INTEGER | not null | fk_class_schedules_subjects_id_subjects | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| class_allocations_index_0 |  | unit_class_id, subjects_id |
### student_guardians

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **student_id** | INTEGER | 🔑 PK, not null | fk_student_guardians_student_id_students | |
| **guardian_id** | INTEGER | 🔑 PK, not null | fk_student_guardians_guardian_id_guardians | |
| **relationship_type** | VARCHAR(20) | not null |  | |
| **is_financial_resp** | TINYINT | not null, default: 0 |  | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| student_guardians_index_0 |  | guardian_id |
### staff_units

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **staff_id** | INTEGER | 🔑 PK, not null | fk_staff_units_staff_id_staff | |
| **unit_id** | INTEGER | 🔑 PK, not null | fk_staff_units_unit_id_units | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| staff_units_index_0 |  | unit_id |
### student_classes

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement |  | |
| **student_id** | INTEGER | not null | fk_student_classes_student_id_students | |
| **unit_class_id** | INTEGER | not null | fk_student_classes_unit_class_id_unit_classes | |
| **enrollment_status** | VARCHAR(20) | not null, default: 'ATIVO' |  | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| student_classes_index_0 | ✅ | student_id, unit_class_id |
### student_grades

| Name        | Type          | Settings                      | References                    | Note                           |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, autoincrement |  | |
| **class_allocation_id** | INTEGER | not null | fk_student_grades_class_schedules_id_class_schedules | |
| **student_classes_id** | INTEGER | not null | fk_student_grades_student_classes_id_student_classes | |
| **grade_1** | DECIMAL(4,2) | not null, default: 0.00 |  | |
| **grade_2** | DECIMAL(4,2) | not null, default: 0.00 |  | |
| **grade_3** | DECIMAL(4,2) | not null, default: 0.00 |  | |
| **grade_4** | DECIMAL(4,2) | not null, default: 0.00 |  | |
| **final_average** | DECIMAL(4,2) | not null, default: 0.00 |  | |
| **subject_status** | VARCHAR(20) | not null, default: 'CURSANDO' |  | |
| **created_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | |
| **updated_at** | DATETIME | not null, default: CURRENT_TIMESTAMP |  | | 


#### Indexes
| Name | Unique | Fields |
|------|--------|--------|
| student_grades_index_0 | ✅ | student_classes_id, class_allocation_id |
## Relationships

- **users to access_levels**: many_to_one
- **students to users**: one_to_one
- **guardians to users**: one_to_one
- **unit_classes to units**: many_to_one
- **staff to users**: one_to_one
- **class_allocations to staff**: many_to_one
- **class_allocations to unit_classes**: many_to_one
- **class_allocations to subjects**: many_to_one
- **student_guardians to students**: many_to_one
- **student_guardians to guardians**: many_to_one
- **staff_units to staff**: many_to_one
- **staff_units to units**: many_to_one
- **student_classes to unit_classes**: many_to_one
- **student_classes to students**: many_to_one
- **student_grades to class_allocations**: many_to_one
- **student_grades to student_classes**: many_to_one
- **students to addresses**: one_to_many
- **guardians to addresses**: one_to_many
- **staff to addresses**: one_to_many
- **units to addresses**: one_to_one

## Database Diagram

```mermaid
erDiagram
	users }o--|| access_levels : references
	students ||--|| users : references
	guardians ||--|| users : references
	unit_classes }o--|| units : references
	staff ||--|| users : references
	class_allocations }o--|| staff : references
	class_allocations }o--|| unit_classes : references
	class_allocations }o--|| subjects : references
	student_guardians }o--|| students : references
	student_guardians }o--|| guardians : references
	staff_units }o--|| staff : references
	staff_units }o--|| units : references
	student_classes }o--|| unit_classes : references
	student_classes }o--|| students : references
	student_grades }o--|| class_allocations : references
	student_grades }o--|| student_classes : references
	students ||--o{ addresses : references
	guardians ||--o{ addresses : references
	staff ||--o{ addresses : references
	units ||--|| addresses : references

	access_levels {
		INTEGER id
		VARCHAR(30) name
		VARCHAR(150) description
		TINYINT manage_account
		TINYINT manage_record
		TINYINT manage_academic
		TINYINT manage_finance
		DATETIME created_at
		DATETIME updated_at
	}

	users {
		INTEGER id
		INTEGER access_level_id
		VARCHAR(255) avatar_url
		VARCHAR(150) email
		VARCHAR(100) password_hash
		TINYINT is_active
		TINYINT is_temporary
		DATETIME created_at
		DATETIME updated_at
	}

	addresses {
		INTEGER id
		INTEGER student_id
		INTEGER guardian_id
		INTEGER staff_id
		INTEGER unit_id
		VARCHAR(9) zip_code
		VARCHAR(100) street
		VARCHAR(10) number
		VARCHAR(100) complement
		VARCHAR(100) neighborhood
		VARCHAR(100) city
		CHAR(2) state
		DATETIME created_at
		DATETIME updated_at
	}

	students {
		INTEGER id
		INTEGER user_id
		VARCHAR(150) avatar_url
		VARCHAR(50) name
		VARCHAR(100) last_name
		VARCHAR(150) email
		VARCHAR(20) registration_number
		DATE birth_date
		VARCHAR(14) cpf
		VARCHAR(3) blood_type
		VARCHAR(255) medical_notes
		DATETIME created_at
		DATETIME updated_at
	}

	guardians {
		INTEGER id
		INTEGER user_id
		VARCHAR(150) avatar_url
		VARCHAR(50) name
		VARCHAR(50) last_name
		VARCHAR(14) cpf
		VARCHAR(15) phone
		VARCHAR(100) email
		DATETIME created_at
		DATETIME updated_at
	}

	units {
		INTEGER id
		VARCHAR(50) name
		DATETIME created_at
		DATETIME updated_at
	}

	unit_classes {
		INTEGER id
		INTEGER unit_id
		VARCHAR(50) grade_level
		VARCHAR(20) room_number
		VARCHAR(4) shift
		VARCHAR(45) school_year
		DATETIME created_at
		DATETIME updated_at
	}

	staff {
		INTEGER id
		INTEGER user_id
		VARCHAR(255) avatar_url
		VARCHAR(150) full_name
		VARCHAR(150) email
		VARCHAR(14) cpf
		DATE birth_date
		VARCHAR(15) phone
		VARCHAR(100) personal_email
		VARCHAR(100) job_title
		VARCHAR(255) medical_notes
		DATE hiring_date
		VARCHAR(20) status
		TINYINT is_active
		DATE termination_date
		DATETIME created_at
		DATETIME updated_at
	}

	subjects {
		INTEGER id
		VARCHAR(50) name
		VARCHAR(10) code
		TEXT(200) description
		VARCHAR(100) knowledge_area
		TINYINT is_elective
		DATETIME created_at
		DATETIME updated_at
	}

	class_allocations {
		INTEGER id
		INTEGER staff_id
		INTEGER unit_class_id
		INTEGER subjects_id
		DATETIME created_at
		DATETIME updated_at
	}

	student_guardians {
		INTEGER student_id
		INTEGER guardian_id
		VARCHAR(20) relationship_type
		TINYINT is_financial_resp
		DATETIME created_at
		DATETIME updated_at
	}

	staff_units {
		INTEGER staff_id
		INTEGER unit_id
		DATETIME created_at
		DATETIME updated_at
	}

	student_classes {
		INTEGER id
		INTEGER student_id
		INTEGER unit_class_id
		VARCHAR(20) enrollment_status
		DATETIME created_at
		DATETIME updated_at
	}

	student_grades {
		INTEGER id
		INTEGER class_allocation_id
		INTEGER student_classes_id
		DECIMAL(4,2) grade_1
		DECIMAL(4,2) grade_2
		DECIMAL(4,2) grade_3
		DECIMAL(4,2) grade_4
		DECIMAL(4,2) final_average
		VARCHAR(20) subject_status
		DATETIME created_at
		DATETIME updated_at
	}
```