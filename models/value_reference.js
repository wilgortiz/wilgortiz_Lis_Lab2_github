'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Value_reference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Value_reference.belongsTo(models.Determinant, { foreignKey: 'determinantId' });
    }
  }
  Value_reference.init({
    gender: DataTypes.STRING,
    age_min: DataTypes.INTEGER, // Cambiado de STRING a INTEGER
    age_max: DataTypes.INTEGER, // Nuevo campo
    pregnant: DataTypes.BOOLEAN,
    max_value: DataTypes.DOUBLE,
    min_value: DataTypes.DOUBLE,
    max_limit: DataTypes.DOUBLE,
    min_limit: DataTypes.DOUBLE,
    value_to: DataTypes.DOUBLE, // Nuevo campo
    active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Value_reference',
  });
  return Value_reference;
};
