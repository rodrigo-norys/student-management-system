"use strict";Object.defineProperty(exports, "__esModule", {value: true});/** @type {import('sequelize-cli').Migration} */
 async function up(queryInterface, Sequelize) {
  return queryInterface.renameColumn('photos', 'aluno_id', 'student_id');
} exports.up = up;

 async function down(queryInterface, Sequelize) {
  return queryInterface.renameColumn('photos', 'student_id', 'aluno_id');
} exports.down = down;
