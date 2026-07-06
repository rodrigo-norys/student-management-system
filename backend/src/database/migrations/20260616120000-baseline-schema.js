/** @type {import('sequelize-cli').Migration} */

// Baseline do schema gerada a partir do estado real de produção (fonte da
// verdade), substituindo o histórico anterior (arquivado em _archive/). Duas
// duplicatas acidentais de prod foram removidas: o índice único `name_2` em
// access_levels e a FK `users_ibfk_1` em users. As tabelas são criadas em
// ordem de dependência de FK. Em ambientes que já possuem o schema (produção),
// este arquivo deve ser registrado na SequelizeMeta para não re-executar.

const createStatements = [
  'CREATE TABLE `access_levels` (`id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(30) NOT NULL, `description` varchar(150) DEFAULT NULL, `hierarchy_weight` int(11) NOT NULL DEFAULT 0, `is_system_level` tinyint(4) NOT NULL DEFAULT 0, `manage_account` tinyint(1) NOT NULL DEFAULT 0, `manage_record` tinyint(1) NOT NULL DEFAULT 0, `manage_academic` tinyint(1) NOT NULL DEFAULT 0, `manage_finance` tinyint(1) NOT NULL DEFAULT 0, `created_at` datetime NOT NULL DEFAULT current_timestamp(), `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(), PRIMARY KEY (`id`), UNIQUE KEY `name` (`name`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci',

  "CREATE TABLE `units` (`id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `cnpj` varchar(18) NOT NULL, `email` varchar(150) NOT NULL, `phone` varchar(15) NOT NULL, `status` enum('active','inactive') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `units_name_unique` (`name`), UNIQUE KEY `units_cnpj_unique` (`cnpj`), UNIQUE KEY `units_email_unique` (`email`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  "CREATE TABLE `subjects` (`id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `code` varchar(10) NOT NULL, `description` text DEFAULT NULL, `knowledge_area` varchar(100) DEFAULT NULL, `is_elective` tinyint(4) NOT NULL DEFAULT 0, `status` enum('active','inactive') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `subjects_index_0` (`name`), UNIQUE KEY `subjects_index_1` (`code`), KEY `subjects_index_2` (`knowledge_area`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  "CREATE TABLE `users` (`id` int(11) NOT NULL AUTO_INCREMENT, `email` varchar(150) NOT NULL, `avatar_url` varchar(255) DEFAULT NULL, `password_hash` varchar(100) NOT NULL, `is_temporary` tinyint(4) NOT NULL DEFAULT 1, `status` enum('active','inactive','transferred','graduated','suspended') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `access_level_id` int(11) DEFAULT NULL, PRIMARY KEY (`id`), UNIQUE KEY `email` (`email`), KEY `access_level_id` (`access_level_id`), CONSTRAINT `users_access_level_id_foreign_idx` FOREIGN KEY (`access_level_id`) REFERENCES `access_levels` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  "CREATE TABLE `staff` (`id` int(11) NOT NULL AUTO_INCREMENT, `user_id` int(11) DEFAULT NULL, `avatar_url` varchar(255) DEFAULT NULL, `full_name` varchar(150) NOT NULL, `email` varchar(150) NOT NULL, `cpf` varchar(14) NOT NULL, `birth_date` date NOT NULL, `phone` varchar(15) NOT NULL, `personal_email` varchar(100) NOT NULL, `job_title` varchar(100) NOT NULL, `hiring_date` date NOT NULL, `termination_date` date DEFAULT NULL, `medical_notes` varchar(255) DEFAULT NULL, `status` enum('active','inactive','suspended','on_leave') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `email` (`email`), UNIQUE KEY `cpf` (`cpf`), UNIQUE KEY `personal_email` (`personal_email`), UNIQUE KEY `user_id` (`user_id`), CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  "CREATE TABLE `students` (`id` int(11) NOT NULL AUTO_INCREMENT, `user_id` int(11) DEFAULT NULL, `avatar_url` varchar(150) DEFAULT NULL, `name` varchar(50) NOT NULL, `last_name` varchar(100) NOT NULL, `email` varchar(255) NOT NULL, `registration_number` varchar(20) NOT NULL, `cpf` varchar(14) NOT NULL, `birth_date` date NOT NULL, `blood_type` varchar(3) DEFAULT NULL, `medical_notes` varchar(255) DEFAULT NULL, `status` enum('active','inactive','transferred','graduated','suspended') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `registration_number` (`registration_number`), UNIQUE KEY `cpf` (`cpf`), KEY `students_user_id_foreign_idx` (`user_id`), KEY `students_name_lastname_index` (`name`,`last_name`), CONSTRAINT `students_user_id_foreign_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  "CREATE TABLE `guardians` (`id` int(11) NOT NULL AUTO_INCREMENT, `user_id` int(11) DEFAULT NULL, `avatar_url` varchar(150) DEFAULT NULL, `name` varchar(50) NOT NULL, `last_name` varchar(50) NOT NULL, `cpf` varchar(14) NOT NULL, `phone` varchar(15) NOT NULL DEFAULT '', `email` varchar(100) NOT NULL, `status` enum('active','inactive') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `cpf` (`cpf`), UNIQUE KEY `email` (`email`), UNIQUE KEY `user_id` (`user_id`), CONSTRAINT `guardians_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  'CREATE TABLE `addresses` (`id` int(11) NOT NULL AUTO_INCREMENT, `student_id` int(11) DEFAULT NULL, `guardian_id` int(11) DEFAULT NULL, `staff_id` int(11) DEFAULT NULL, `unit_id` int(11) DEFAULT NULL, `zip_code` varchar(9) NOT NULL, `street` varchar(100) NOT NULL, `number` varchar(10) NOT NULL, `complement` varchar(100) DEFAULT NULL, `neighborhood` varchar(100) NOT NULL, `city` varchar(100) NOT NULL, `state` char(2) NOT NULL, `created_at` datetime NOT NULL DEFAULT current_timestamp(), `updated_at` datetime NOT NULL DEFAULT current_timestamp(), PRIMARY KEY (`id`), UNIQUE KEY `unit_id` (`unit_id`), KEY `addresses_index_0` (`zip_code`), KEY `student_id` (`student_id`), CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci',

  "CREATE TABLE `unit_classes` (`id` int(11) NOT NULL AUTO_INCREMENT, `unit_id` int(11) NOT NULL, `name` varchar(20) NOT NULL, `grade_level` varchar(50) NOT NULL, `room_number` varchar(20) NOT NULL, `shift` varchar(15) NOT NULL, `school_year` varchar(45) NOT NULL, `max_students` int(11) NOT NULL, `status` enum('active','inactive') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `unit_classes_index_0` (`unit_id`,`room_number`,`shift`,`school_year`), UNIQUE KEY `unit_classes_index_1` (`unit_id`,`name`,`school_year`), KEY `unit_classes_index_2` (`grade_level`), CONSTRAINT `unit_classes_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  "CREATE TABLE `staff_units` (`id` int(11) NOT NULL AUTO_INCREMENT, `staff_id` int(11) NOT NULL, `unit_id` int(11) NOT NULL, `status` enum('active','inactive') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `staff_units_index_1` (`staff_id`,`unit_id`), KEY `staff_units_index_0` (`unit_id`), CONSTRAINT `staff_units_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `staff_units_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  "CREATE TABLE `student_guardians` (`student_id` int(11) NOT NULL, `guardian_id` int(11) NOT NULL, `relationship_type` varchar(30) NOT NULL, `is_financial_resp` tinyint(4) NOT NULL DEFAULT 0, `is_emergency_contact` tinyint(4) NOT NULL DEFAULT 0, `status` enum('active','inactive') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`student_id`,`guardian_id`), KEY `student_guardians_index_0` (`guardian_id`), KEY `student_guardians_index_1` (`student_id`), CONSTRAINT `student_guardians_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `student_guardians_ibfk_2` FOREIGN KEY (`guardian_id`) REFERENCES `guardians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  "CREATE TABLE `class_allocations` (`id` int(11) NOT NULL AUTO_INCREMENT, `staff_id` int(11) NOT NULL, `unit_class_id` int(11) NOT NULL, `subject_id` int(11) NOT NULL, `status` enum('active','inactive') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `class_allocations_index_0` (`unit_class_id`,`subject_id`), KEY `subject_id` (`subject_id`), KEY `class_allocations_index_1` (`staff_id`), CONSTRAINT `class_allocations_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `class_allocations_ibfk_2` FOREIGN KEY (`unit_class_id`) REFERENCES `unit_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `class_allocations_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  "CREATE TABLE `student_classes` (`id` int(11) NOT NULL AUTO_INCREMENT, `student_id` int(11) NOT NULL, `unit_class_id` int(11) NOT NULL, `enrollment_date` date NOT NULL, `enrollment_status` enum('active','inactive','transferred','dropped_out','graduated') DEFAULT 'active', `created_at` datetime NOT NULL, `status` enum('active','inactive') NOT NULL DEFAULT 'active', `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `student_classes_index_0` (`student_id`,`unit_class_id`), KEY `student_classes_index_1` (`unit_class_id`), CONSTRAINT `student_classes_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `student_classes_ibfk_2` FOREIGN KEY (`unit_class_id`) REFERENCES `unit_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  'CREATE TABLE `photos` (`id` int(11) NOT NULL AUTO_INCREMENT, `originalname` varchar(255) NOT NULL, `filename` varchar(255) NOT NULL, `student_id` int(11) DEFAULT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), KEY `student_id` (`student_id`), CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci',

  "CREATE TABLE `attendances` (`id` int(11) NOT NULL AUTO_INCREMENT, `student_id` int(11) NOT NULL, `class_allocation_id` int(11) NOT NULL, `date` date NOT NULL, `attendance_status` enum('present','absent','justified') NOT NULL DEFAULT 'present', `notes` varchar(255) DEFAULT NULL, `status` enum('active','inactive') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `attendances_index_0` (`student_id`,`class_allocation_id`,`date`), KEY `class_allocation_id` (`class_allocation_id`), KEY `attendances_index_1` (`date`), CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `attendances_ibfk_2` FOREIGN KEY (`class_allocation_id`) REFERENCES `class_allocations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

  "CREATE TABLE `student_grades` (`id` int(11) NOT NULL AUTO_INCREMENT, `class_allocation_id` int(11) NOT NULL, `student_classes_id` int(11) NOT NULL, `grade_1` decimal(4,2) NOT NULL DEFAULT 0.00, `grade_2` decimal(4,2) NOT NULL DEFAULT 0.00, `grade_3` decimal(4,2) NOT NULL DEFAULT 0.00, `grade_4` decimal(4,2) NOT NULL DEFAULT 0.00, `final_average` decimal(4,2) NOT NULL DEFAULT 0.00, `absences` int(11) NOT NULL DEFAULT 0, `subject_status` enum('studying','approved','failed','recovery') DEFAULT 'studying', `status` enum('active','inactive') NOT NULL DEFAULT 'active', `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `student_grades_index_0` (`student_classes_id`,`class_allocation_id`), KEY `class_allocation_id` (`class_allocation_id`), CONSTRAINT `student_grades_ibfk_1` FOREIGN KEY (`class_allocation_id`) REFERENCES `class_allocations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `student_grades_ibfk_2` FOREIGN KEY (`student_classes_id`) REFERENCES `student_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",
];

const dropOrder = [
  'student_grades',
  'attendances',
  'photos',
  'student_classes',
  'class_allocations',
  'student_guardians',
  'staff_units',
  'unit_classes',
  'addresses',
  'guardians',
  'students',
  'staff',
  'users',
  'subjects',
  'units',
  'access_levels',
];

export async function up(queryInterface) {
  for (const statement of createStatements) {
    await queryInterface.sequelize.query(statement);
  }
}

export async function down(queryInterface) {
  for (const table of dropOrder) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS \`${table}\``);
  }
}
