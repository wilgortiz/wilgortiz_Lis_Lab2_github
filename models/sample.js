'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sample extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Sample.belongsToMany(models.Exam, { through: models.ExamSample }); //N..N, through es la tabla intermedia que se genera entre las dos relacions
      //Sample.belongsToMany(models.Order, { through: models.OrderSample });

      //Sample.hasMany(models.ExamSample);


      //para los resultados funciona sin nada aca
    
    
    //PRUEBA 51
    
      Sample.belongsToMany(models.Exam, { through: models.ExamSample, foreignKey: 'sampleId' });
  
    }
  }
  Sample.init({
    type: DataTypes.STRING,
    detail: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Sample',
  });
  return Sample;
};