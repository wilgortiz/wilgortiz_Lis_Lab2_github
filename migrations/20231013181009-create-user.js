'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      // nameComplete: {
      //   type: Sequelize.STRING
      // },
      gender: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      dni: {
        type: Sequelize.INTEGER
      },
      phone: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      adress: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      direction: {
        type: Sequelize.STRING
      },
      diagnostic: {
        type: Sequelize.STRING
      },
      pregnant: {
        type: Sequelize.BOOLEAN
      },
      birthdate: {
        type: Sequelize.DATE
      },
      rol: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};