import Sequelize from "sequelize";
import databaseConfig from '../config/database';

import User from '../models/User.js';
import AccessLevel from '../models/AccessLevel.js';
import Student from '../models/Student.js';
import Address from '../models/Address.js';
import Staff from '../models/Staff.js';

const models = [User, AccessLevel, Student, Address, Staff];

const connection = new Sequelize(databaseConfig.development);

models.map(model => model.init(connection));
models.map(model => model.associate && model.associate(connection.models));

export default connection;
