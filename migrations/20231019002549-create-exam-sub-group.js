"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Exam_sub_groups", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      detail: {
        type: Sequelize.STRING,
      },
      active: {
        type: Sequelize.BOOLEAN,
      },
      examId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Exams", // Hace referencia a la tabla 'Exams' de donde voy a sacar la clave foranea
          key: "id", // Utiliza la clave primaria 'id' que es la que sequelize agrego por defecto a los modelos en la DB, por que no las especifique en el modelo
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
    await queryInterface.dropTable("Exam_sub_groups");
  },
};
