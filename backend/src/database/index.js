import Sequelize from "sequelize";
import databaseConfig from '../config/database';

import Student from '../models/Student.js';
import User from '../models/User.js';
import Address from '../models/Address.js';
import AccessLevel from '../models/AccessLevel.js';

const models = [Student, User, Address, AccessLevel];

const connection = new Sequelize(databaseConfig.development);

models.map(model => model.init(connection));
models.map(model => model.associate && model.associate(connection.models));

export default connection;
