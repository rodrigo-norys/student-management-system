"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

/** @type {import('sequelize-cli').Migration} */
 async function up(queryInterface) {
  const usersData = [];
  for (let i = 1; i < 4; i++) {

    usersData.push({
      name: `Creison${i}`,
      email: `creison${i}@gmail.com`,
      password_hash: await _bcryptjs2.default.hash('123456', 8),
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  return await queryInterface.bulkInsert(
    'users',
    usersData,
    {}
  );
} exports.up = up;

async function down() {

}
