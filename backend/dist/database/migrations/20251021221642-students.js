"use strict";Object.defineProperty(exports, "__esModule", {value: true});/** @type {import('sequelize-cli').Migration} */
 async function up(queryInterface, Sequelize) {
  return await queryInterface.createTable('students', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    age: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    weight: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    height: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
} exports.up = up;
 async function down(queryInterface, Sequelize) {
  return await queryInterface.dropTable('users');
} exports.down = down;
