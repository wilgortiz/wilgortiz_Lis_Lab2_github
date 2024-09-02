'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Determinant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Determinant.hasMany(models.Value_reference);
      // Asociación con Exam a través de ExamDeterminant
      Determinant.belongsToMany(models.Exam, { through: models.ExamDeterminant, foreignKey: 'determinantId' });
      //Determinant.hasOne(models.Result);
      //Determinant.hasMany(models.Result);

       // Asociación con Value_reference
       //Determinant.hasMany(models.Value_reference, { foreignKey: 'determinantId' });
       //prueba 50
       //Determinant.hasMany(models.ExamDeterminant, { foreignKey: 'determinantId' });

       // Asociación con Exam a través de ExamDeterminant
       //Determinant.belongsToMany(models.Exam, { through: models.ExamDeterminant, foreignKey: 'determinantId' });
 
       // Asociación con Result (si cada determinante tiene un único resultado)
       //Determinant.hasOne(models.Result, { foreignKey: 'determinantId' });
 
       // O si cada determinante puede tener múltiples resultados:
        //Determinant.hasMany(models.Result, { foreignKey: 'determinantId' });


       // Determinant.hasMany(models.ExamDeterminant, { foreignKey: 'determinantId' });


       
       Determinant.hasMany(models.Value_reference, {
        foreignKey: 'determinantId',
        //as: 'valueReferences'
      });
    }
  }
  Determinant.init({
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING,
    detail: DataTypes.STRING,
    measurement: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Determinant',
  });
  return Determinant;
};