'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Schools', {
      school_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      address: Sequelize.STRING,
      type: {
        type: Sequelize.ENUM('school', 'private'),
        defaultValue: 'school',
        allowNull: false,
      },
      staff_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      shortcode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      framework: {
        type: Sequelize.INTEGER,
        defaultValue: 3,
      },
      website: Sequelize.STRING,
      terms_private: Sequelize.STRING,
      terms_school: Sequelize.JSON,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Schools');
  },
};
