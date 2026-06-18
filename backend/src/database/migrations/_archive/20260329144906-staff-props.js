export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('staff', 'medical_notes', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('staff', 'is_active', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addColumn('staff', 'termination_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('staff', 'medical_notes');
    await queryInterface.removeColumn('staff', 'is_active');
    await queryInterface.removeColumn('staff', 'termination_date');
  },
};
