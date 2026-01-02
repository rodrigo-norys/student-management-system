"use strict";Object.defineProperty(exports, "__esModule", {value: true});/** @type {import('sequelize-cli').Migration} */
 async function up(queryInterface, Sequelize) {
  return queryInterface.renameColumn('photos', 'originalName', 'originalname'),
    queryInterface.renameColumn('photos', 'fileName', 'filename');
} exports.up = up;

 async function down(queryInterface, Sequelize) {
  return queryInterface.renameColumn('photos', 'originalname', 'originalName'),
    queryInterface.renameColumn('photos', 'filename', 'fileName');
} exports.down = down;
