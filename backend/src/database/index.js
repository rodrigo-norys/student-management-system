import Sequelize from "sequelize";
import databaseConfig from '../config/database.js';

import User from '../models/User.js';
import AccessLevel from '../models/AccessLevel.js';
import Student from '../models/Student.js';
import Address from '../models/Address.js';
import Staff from '../models/Staff.js';
import Guardian from '../models/Guardian.js';
import StudentGuardian from '../models/StudentGuardian.js';

const models = [User, AccessLevel, Student, Address, Staff, Guardian, StudentGuardian];

const connection = new Sequelize(databaseConfig.development);

models.map(model => model.init(connection));
models.map(model => model.associate && model.associate(connection.models));

export default connection;

