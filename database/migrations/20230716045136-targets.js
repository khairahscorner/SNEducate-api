'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Targets', {
      target_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      success_rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      prev_rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      notes: Sequelize.TEXT,
      goal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Goals',
          key: 'goal_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
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
    await queryInterface.dropTable('Targets');
  },
};

