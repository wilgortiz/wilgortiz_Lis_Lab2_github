'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Agregar las columnas 'fechaIngreso' y 'fechaEntregaResultados' a la tabla 'Orders'
    await queryInterface.addColumn('Orders', 'fechaIngreso', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Orders', 'fechaEntregaResultados', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    // Eliminar las columnas 'fechaIngreso' y 'fechaEntregaResultados' de la tabla 'Orders'
    await queryInterface.removeColumn('Orders', 'fechaIngreso');
    await queryInterface.removeColumn('Orders', 'fechaEntregaResultados');
  }
};
