'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exam_sub_group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Exam_sub_group.hasMany(models.Determinant);
    }
  }
  Exam_sub_group.init({
    name: DataTypes.STRING,
    detail: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Exam_sub_group',
  });
  return Exam_sub_group;
};