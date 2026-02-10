CREATE TABLE IF NOT EXISTS `access_levels` (
	`id` INTEGER NOT NULL,
	`name` VARCHAR(45) NOT NULL,
	`description` VARCHAR(45) NOT NULL,
	`manage_account` TINYINT NOT NULL,
	`manage_record` TINYINT NOT NULL,
	`manage_finance` TINYINT NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `users` (
	`id` INTEGER NOT NULL,
	`access_level_id` INTEGER NOT NULL,
	`avatar_url` VARCHAR(255) NOT NULL,
	`email` VARCHAR(45) NOT NULL,
	`password_hash` VARCHAR(45) NOT NULL,
	`is_active` TINYINT NOT NULL,
	`is_temporary` TINYINT NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `addresses` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`zip_code` VARCHAR(45) NOT NULL,
	`street` VARCHAR(45) NOT NULL,
	`number` VARCHAR(45) NOT NULL,
	`complement` VARCHAR(45) NOT NULL,
	`neighborhood` VARCHAR(45) NOT NULL,
	`city` VARCHAR(45) NOT NULL,
	`state` CHAR(2) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `students` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`user_id` INTEGER NOT NULL,
	`addresses_id` INTEGER NOT NULL,
	`avatar_url` VARCHAR(255) NOT NULL,
	`name` VARCHAR(45) NOT NULL,
	`last_name` VARCHAR(45) NOT NULL,
	`registration_number` VARCHAR(45) NOT NULL,
	`birth_date` DATETIME NOT NULL,
	`cpf` VARCHAR(45) NOT NULL,
	`blood_type` CHAR(2) NOT NULL,
	`medical_notes` TEXT(200) NOT NULL,
	PRIMARY KEY(`id`)
) COMMENT='2';


CREATE TABLE IF NOT EXISTS `guardians` (
	`id` INTEGER NOT NULL,
	`user_id` INTEGER NOT NULL,
	`addresses_id` INTEGER NOT NULL,
	`avatar_url` VARCHAR(255) NOT NULL,
	`name` VARCHAR(45) NOT NULL,
	`last_name` VARCHAR(45) NOT NULL,
	`cpf` VARCHAR(45) NOT NULL,
	`phone` VARCHAR(45) NOT NULL,
	`email` VARCHAR(45) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `units` (
	`id` INTEGER NOT NULL,
	`addresses_id` INTEGER NOT NULL,
	`name` VARCHAR(45) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `unit_classes` (
	`id` INTEGER NOT NULL,
	`unit_id` INTEGER NOT NULL,
	`name` VARCHAR(45) NOT NULL,
	`shift` VARCHAR(45) NOT NULL,
	`school_year` VARCHAR(45) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `staff` (
	`id` INTEGER NOT NULL,
	`user_id` INTEGER NOT NULL,
	`addresses_id` INTEGER NOT NULL,
	`avatar_url` VARCHAR(255) NOT NULL,
	`name` VARCHAR(50) NOT NULL,
	`cpf` VARCHAR(14) NOT NULL,
	`birth_date` DATETIME NOT NULL,
	`phone` VARCHAR(20) NOT NULL,
	`personal_email` VARCHAR(45) NOT NULL,
	`job_title` VARCHAR(45) NOT NULL,
	`hiring_date` VARCHAR(45) NOT NULL,
	`status` VARCHAR(45) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `subjects` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(45) NOT NULL,
	`code` VARCHAR(45) NOT NULL,
	`description` TEXT(200) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `class_allocations` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`staff_id` INTEGER NOT NULL,
	`unit_class_id` INTEGER NOT NULL,
	`subjects_id` INTEGER NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `student_guardians` (
	`student_id` INTEGER NOT NULL,
	`guardian_id` INTEGER NOT NULL,
	PRIMARY KEY(`student_id`, `guardian_id`)
);


CREATE TABLE IF NOT EXISTS `staff_units` (
	`staff_id` INTEGER NOT NULL,
	`unit_id` INTEGER NOT NULL,
	PRIMARY KEY(`staff_id`, `unit_id`)
);


CREATE TABLE IF NOT EXISTS `student_classes` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`unit_class_id` INTEGER NOT NULL,
	`student_id` INTEGER NOT NULL,
	`enrollment_status` VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `student_grades` (
	`id` INTEGER NOT NULL,
	`class_schedules_id` INTEGER NOT NULL,
	`student_classes_id` INTEGER NOT NULL,
	`grade_1` DECIMAL(4,2) NOT NULL,
	`grade_2` DECIMAL(4,2) NOT NULL,
	`grade_3` DECIMAL(4,2) NOT NULL,
	`grade_4` DECIMAL(4,2) NOT NULL,
	`final_average` DECIMAL(4,2) NOT NULL,
	`subject_status` VARCHAR(20) NOT NULL,
	PRIMARY KEY(`id`)
);


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
ADD FOREIGN KEY(`class_schedules_id`) REFERENCES `class_allocations`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `student_grades`
ADD FOREIGN KEY(`student_classes_id`) REFERENCES `student_classes`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;