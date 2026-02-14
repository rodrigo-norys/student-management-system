import Sequelize from "sequelize";
import databaseConfig from '../config/database';

import Student from '../models/Student.js';
import User from '../models/User.js';
import Photo from '../models/Photo.js';
import Addresses from '../models/Addresses.js'

const models = [Student, User, Photo, Addresses];

const connection = new Sequelize(databaseConfig.development);

models.map(model => model.init(connection));
models.map(model => model.associate && model.associate(connection.models));
