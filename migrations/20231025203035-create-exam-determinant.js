'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ExamDeterminants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      determinantId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Determinants',
          key: 'id',
        },
        onDelete: 'CASCADE', //esto permite que cuando se borre una clave primaria involucrada en esta ascocian, tambien se borre la fila en la que este relacionada en esta tabla
      },
      ExamId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Exams',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('ExamDeterminants');
  }
};