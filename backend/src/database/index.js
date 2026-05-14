import Sequelize from 'sequelize';
import databaseConfig from '../config/database.js';

import AccessLevel from '../models/AccessLevel.js';
import Address from '../models/Address.js';
import Attendance from '../models/Attendance.js';
import ClassAllocation from '../models/ClassAllocation.js';
import Guardian from '../models/Guardian.js';
import Staff from '../models/Staff.js';
import StaffUnit from '../models/StaffUnit.js';
import Student from '../models/Student.js';
import StudentClass from '../models/StudentClass.js';
import StudentGrade from '../models/StudentGrade.js';
import StudentGuardian from '../models/StudentGuardian.js';
import Subject from '../models/Subject.js';
import Unit from '../models/Unit.js';
import UnitClass from '../models/UnitClass.js';
import User from '../models/User.js';

const models = [
  AccessLevel,
  Address,
  Attendance,
  ClassAllocation,
  Guardian,
  Staff,
  StaffUnit,
  Student,
  StudentClass,
  StudentGrade,
  StudentGuardian,
  Subject,
  Unit,
  UnitClass,
  User,
];

const connection = new Sequelize(databaseConfig.development);

models.map((model) => model.init(connection));
models.map((model) => model.associate && model.associate(connection.models));

export default connection;
