/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return queryInterface.renameColumn('photos', 'originalName', 'originalname'),
    queryInterface.renameColumn('photos', 'fileName', 'filename');
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.renameColumn('photos', 'originalname', 'originalName'),
    queryInterface.renameColumn('photos', 'filename', 'fileName');
}
