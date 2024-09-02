'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add altering commands here
    await queryInterface.addColumn('value_references', 'age_min', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('value_references', 'age_max', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('value_references', 'value_to', {
      type: Sequelize.DOUBLE,
      allowNull: true,
    });
    await queryInterface.removeColumn('Value_references', 'age');
  },

  async down (queryInterface, Sequelize) {
    // Add reverting commands here
    await queryInterface.addColumn('Value_references', 'age', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn('Value_references', 'age_min');
    await queryInterface.removeColumn('Value_references', 'age_max');
    await queryInterface.removeColumn('Value_references', 'value_to');
  }
};
