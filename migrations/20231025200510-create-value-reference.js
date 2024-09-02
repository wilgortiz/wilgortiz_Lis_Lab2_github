"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Value_references", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.STRING,
      },
      age: {
        type: Sequelize.STRING,
      },
      pregnant: {
        type: Sequelize.BOOLEAN,
      },
      max_value: {
        type: Sequelize.DOUBLE,
      },
      min_value: {
        type: Sequelize.DOUBLE,
      },
      max_limit: {
        type: Sequelize.DOUBLE,
      },
      min_limit: {
        type: Sequelize.DOUBLE,
      },
      active: {
        type: Sequelize.BOOLEAN,
      },
      determinantId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Determinants",
          key: "id",
        },
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Value_references");
  }
};
