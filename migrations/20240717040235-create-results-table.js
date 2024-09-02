'use strict';
/** @type {import('sequelize').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderExamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OrderExams',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      examDeterminantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ExamDeterminants',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      value: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.addIndex('Results', ['orderExamId']);
    await queryInterface.addIndex('Results', ['examDeterminantId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Results');
  }
};
