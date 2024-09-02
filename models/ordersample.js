'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderSample extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //OrderSample.belongsTo(models.Sample);
      //OrderSample.belongsTo(models.Order);
      //OrderSample.belongsTo(models.Exam);
    }
  }
  OrderSample.init({
    sampleId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE


  }, {
    sequelize,
    modelName: 'OrderSample',
  });
  return OrderSample;
};