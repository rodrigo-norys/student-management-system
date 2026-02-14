CREATE TABLE IF NOT EXISTS `access_levels` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(45) NOT NULL,
	`description` VARCHAR(255) NOT NULL,
	`manage_account` TINYINT NOT NULL,
	`manage_record` TINYINT NOT NULL,
	`manage_finance` TINYINT NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
) COMMENT=' A coluna NAME agirá de forma mais abrangente. Deixando a tabela STAFF agir de forma mais precisa com a coluna job_title, com algo como Math professor.';


CREATE TABLE IF NOT EXISTS `users` (
	`id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'FK to access access_levels',
	`access_level_id` INTEGER NOT NULL,
	`avatar_url` VARCHAR(255),
	`email` VARCHAR(100) NOT NULL UNIQUE,
	`password_hash` VARCHAR(255) NOT NULL,
	`is_active` TINYINT NOT NULL DEFAULT 1,
	`is_temporary` TINYINT NOT NULL DEFAULT 1 COMMENT '1 = to force change of password on first login',
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE INDEX `users_index_0`
ON `users` (`email`);
CREATE TABLE IF NOT EXISTS `addresses` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`zip_code` VARCHAR(9) NOT NULL,
	`street` VARCHAR(100) NOT NULL,
	`number` VARCHAR(10) NOT NULL,
	`complement` VARCHAR(100) DEFAULT NULL,
	`neighborhood` VARCHAR(100) NOT NULL,
	`city` VARCHAR(100) NOT NULL,
	`state` CHAR(2) NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE INDEX `addresses_index_0`
ON `addresses` (`zip_code`);
CREATE TABLE IF NOT EXISTS `students` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`user_id` INTEGER NOT NULL UNIQUE,
	`addresses_id` INTEGER NOT NULL,
	`avatar_url` VARCHAR(255),
	`name` VARCHAR(50) NOT NULL,
	`last_name` VARCHAR(100) NOT NULL,
	`registration_number` VARCHAR(20) NOT NULL UNIQUE,
	`birth_date` DATE NOT NULL,
	`cpf` VARCHAR(14) NOT NULL UNIQUE,
	`blood_type` VARCHAR(3),
	`medical_notes` TEXT(200),
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE INDEX `students_index_0`
ON `students` (`registration_number`);
CREATE INDEX `students_index_1`
ON `students` (`name`, `last_name`);
CREATE TABLE IF NOT EXISTS `guardians` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`user_id` INTEGER NOT NULL UNIQUE,
	`addresses_id` INTEGER NOT NULL,
	`avatar_url` VARCHAR(255),
	`name` VARCHAR(50) NOT NULL,
	`last_name` VARCHAR(50) NOT NULL,
	`cpf` VARCHAR(14) NOT NULL UNIQUE,
	`phone` VARCHAR(15) NOT NULL,
	`email` VARCHAR(100) NOT NULL UNIQUE,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE INDEX `guardians_index_0`
ON `guardians` (`cpf`);
CREATE INDEX `guardians_index_1`
ON `guardians` (`name`, `last_name`);
CREATE TABLE IF NOT EXISTS `units` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`addresses_id` INTEGER NOT NULL UNIQUE,
	`name` VARCHAR(50) NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE INDEX `units_index_0`
ON `units` (`name`);
CREATE TABLE IF NOT EXISTS `unit_classes` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`unit_id` INTEGER NOT NULL,
	`grade_level` VARCHAR(50) NOT NULL,
	`room_number` VARCHAR(20) NOT NULL,
	`shift` VARCHAR(4) NOT NULL,
	`school_year` VARCHAR(45) NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE UNIQUE INDEX `unit_classes_index_0`
ON `unit_classes` (`unit_id`, `room_number`, `shift`, `school_year`);
CREATE INDEX `unit_classes_index_1`
ON `unit_classes` (`grade_level`);
CREATE TABLE IF NOT EXISTS `staff` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`user_id` INTEGER NOT NULL UNIQUE,
	`addresses_id` INTEGER NOT NULL,
	`avatar_url` VARCHAR(255),
	`full_name` VARCHAR(150) NOT NULL UNIQUE,
	`cpf` VARCHAR(14) NOT NULL UNIQUE,
	`birth_date` DATE NOT NULL,
	`phone` VARCHAR(15) NOT NULL,
	`personal_email` VARCHAR(100) NOT NULL UNIQUE,
	`job_title` VARCHAR(100) NOT NULL,
	`hiring_date` DATE NOT NULL,
	`status` VARCHAR(20) NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `subjects` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL,
	`code` VARCHAR(10) NOT NULL UNIQUE,
	`description` TEXT(200),
	`knowledge_area` VARCHAR(100),
	`is_elective` TINYINT NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE INDEX `subjects_index_0`
ON `subjects` (`name`);
CREATE INDEX `subjects_index_1`
ON `subjects` (`knowledge_area`);
CREATE TABLE IF NOT EXISTS `class_allocations` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`staff_id` INTEGER NOT NULL,
	`unit_class_id` INTEGER NOT NULL,
	`subjects_id` INTEGER NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE INDEX `class_allocations_index_0`
ON `class_allocations` (`unit_class_id`, `subjects_id`);
CREATE TABLE IF NOT EXISTS `student_guardians` (
	`student_id` INTEGER NOT NULL,
	`guardian_id` INTEGER NOT NULL,
	`relationship_type` VARCHAR(20) NOT NULL,
	`is_financial_resp` TINYINT NOT NULL DEFAULT 0,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`student_id`, `guardian_id`)
);


CREATE INDEX `student_guardians_index_0`
ON `student_guardians` (`guardian_id`);
CREATE TABLE IF NOT EXISTS `staff_units` (
	`staff_id` INTEGER NOT NULL,
	`unit_id` INTEGER NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`staff_id`, `unit_id`)
);


CREATE INDEX `staff_units_index_0`
ON `staff_units` (`unit_id`);
CREATE TABLE IF NOT EXISTS `student_classes` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`student_id` INTEGER NOT NULL,
	`unit_class_id` INTEGER NOT NULL,
	`enrollment_status` VARCHAR(20) NOT NULL DEFAULT '''ATIVO''',
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE UNIQUE INDEX `student_classes_index_0`
ON `student_classes` (`student_id`, `unit_class_id`);
CREATE TABLE IF NOT EXISTS `student_grades` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`class_allocation_id` INTEGER NOT NULL,
	`student_classes_id` INTEGER NOT NULL,
	`grade_1` DECIMAL(4,2) NOT NULL DEFAULT 0.00,
	`grade_2` DECIMAL(4,2) NOT NULL DEFAULT 0.00,
	`grade_3` DECIMAL(4,2) NOT NULL DEFAULT 0.00,
	`grade_4` DECIMAL(4,2) NOT NULL DEFAULT 0.00,
	`final_average` DECIMAL(4,2) NOT NULL DEFAULT 0.00,
	`subject_status` VARCHAR(20) NOT NULL DEFAULT '''CURSANDO''',
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE UNIQUE INDEX `student_grades_index_0`
ON `student_grades` (`student_classes_id`, `class_allocation_id`);
ALTER TABLE `users`
ADD FOREIGN KEY(`access_level_id`) REFERENCES `access_levels`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `students`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `students`
ADD FOREIGN KEY(`addresses_id`) REFERENCES `addresses`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `guardians`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `guardians`
ADD FOREIGN KEY(`addresses_id`) REFERENCES `addresses`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `units`
ADD FOREIGN KEY(`addresses_id`) REFERENCES `addresses`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `unit_classes`
ADD FOREIGN KEY(`unit_id`) REFERENCES `units`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `staff`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `staff`
ADD FOREIGN KEY(`addresses_id`) REFERENCES `addresses`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `class_allocations`
ADD FOREIGN KEY(`staff_id`) REFERENCES `staff`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `class_allocations`
ADD FOREIGN KEY(`unit_class_id`) REFERENCES `unit_classes`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `class_allocations`
ADD FOREIGN KEY(`subjects_id`) REFERENCES `subjects`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `student_guardians`
ADD FOREIGN KEY(`student_id`) REFERENCES `students`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `student_guardians`
ADD FOREIGN KEY(`guardian_id`) REFERENCES `guardians`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `staff_units`
ADD FOREIGN KEY(`staff_id`) REFERENCES `staff`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `staff_units`
ADD FOREIGN KEY(`unit_id`) REFERENCES `units`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `student_classes`
ADD FOREIGN KEY(`unit_class_id`) REFERENCES `unit_classes`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `student_classes`
ADD FOREIGN KEY(`student_id`) REFERENCES `students`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `student_grades`
ADD FOREIGN KEY(`class_allocation_id`) REFERENCES `class_allocations`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `student_grades`
ADD FOREIGN KEY(`student_classes_id`) REFERENCES `student_classes`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;