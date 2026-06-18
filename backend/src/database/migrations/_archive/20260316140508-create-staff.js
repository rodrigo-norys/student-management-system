'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('staff', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    avatar_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    full_name: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(150),
      allowNull: false,
      unique: true,
    },
    cpf: {
      type: Sequelize.STRING(14),
      allowNull: false,
      unique: true,
    },
    birth_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
    personal_email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    job_title: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    hiring_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'active',
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
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('staff');
}
