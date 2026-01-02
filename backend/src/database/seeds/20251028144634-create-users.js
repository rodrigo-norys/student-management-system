import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const usersData = [];
  for (let i = 1; i < 4; i++) {

    usersData.push({
      name: `Creison${i}`,
      email: `creison${i}@gmail.com`,
      password_hash: await bcrypt.hash('123456', 8),
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  return await queryInterface.bulkInsert(
    'users',
    usersData,
    {}
  );
}

async function down() {

}
