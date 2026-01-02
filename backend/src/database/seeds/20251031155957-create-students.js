/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
    const studentsData = [];
    for (let i = 1; i < 11; i++) {

      studentsData.push({
        name: `Chico${i}`,
        last_name: 'Freitas',
        email: `chico${i}@gmail.com`,
        age: i,
        weight: 80,
        height: 1.72,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return await queryInterface.bulkInsert(
    'students',
    studentsData,
    {}
  );
}

async function down(queryInterface, Sequelize) {

}

