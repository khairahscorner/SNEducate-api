'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Students', {
      student_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      year_enrolled: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_email: Sequelize.STRING,
      contact_phone: Sequelize.STRING,
      grade_color: Sequelize.STRING,
      current_rating: Sequelize.INTEGER,
      school_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Schools',
          key: 'school_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      staff_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Staffs',
          key: 'staff_id'
        },
        onUpdate: 'CASCADE'
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
    await queryInterface.dropTable('Students');
  },
};

