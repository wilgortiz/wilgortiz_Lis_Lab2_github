'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Audits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      entityId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      entityType: {
        type: Sequelize.STRING,
        allowNull: false  // Ej: "Paciente", "Examen"
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userRole: {
        type: Sequelize.STRING,
        allowNull: false
      },
      oldValue: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      newValue: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      actionTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      actionType: {
        type: Sequelize.STRING,
        allowNull: false  // Ej: "Creación", "Modificación", "Eliminación"
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Audits');
  }
};
