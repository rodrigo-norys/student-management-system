import Sequelize from "sequelize";
import databaseConfig from '../config/database';
import Student from '../models/Student';
import User from '../models/User';
import Photo from '../models/Photo';

const models = [Student, User, Photo];

const connection = new Sequelize(databaseConfig.development);

models.map(model => model.init(connection));
models.map(model => model.associate && model.associate(connection.models));
