'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  /*
  class Exam extends Model {
   


    static associate(models) {
      // define association here
      Exam.belongsToMany(models.Sample, { through: 'ExamSample' }); //N..N
      Exam.belongsToMany(models.Determinant, { through: 'ExamDeterminant' }); //N..N
      Exam.belongsToMany(models.Order, { through: models.OrderExam });

    }
  }
*/

  class Exam extends Model {
    static associate(models) {
      Exam.belongsToMany(models.Order, { through: models.OrderExam });
      
      // Exam.hasMany(models.Result);
      /*
       // Asociaciones con OrderExam
       Exam.belongsToMany(models.Order, {
         through: models.OrderExam,
         foreignKey: 'examId',
         otherKey: 'orderId'
       });
   
       //prueba 50
       Exam.hasMany(models.OrderExam, { foreignKey: 'examId' });
      Exam.hasMany(models.ExamDeterminant, { foreignKey: 'examId' });
      */


     // Exam.hasMany(models.ExamDeterminant, { foreignKey: 'examId' });
      //Exam.hasMany(models.OrderExam, { foreignKey: 'examId' });
      //Exam.hasMany(models.ExamSample );
      //Exam.belongsToMany(models.Determinant, {
        //through: models.ExamDeterminant,
        //foreignKey:   'examId',   });
        //Exam.belongsTo(models.ExamDeterminant, { foreignKey: 'examId' });





      //funciona con la ruta /orders/:id
      //Exam.hasMany(models.OrderExam);



      //PRUEBA 51
        Exam.hasMany(models.OrderExam);
        //Exam.belongsToMany(models.Order, { through: 'OrderExam', foreignKey: 'examId' });

        Exam.belongsToMany(models.Determinant, { through: models.ExamDeterminant, foreignKey: 'examId' });



        Exam.belongsToMany(models.Sample, { through: models.ExamSample, foreignKey: 'examId' });






        Exam.hasMany(models.ExamDeterminant);










        //uniendo a orderexm
        Exam.belongsToMany(models.Order, { through: models.OrderExam });
    }
  }


  Exam.init({
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING,
    detail: DataTypes.STRING,
    active: DataTypes.BOOLEAN,

  }, {
    sequelize,
    modelName: 'Exam',
  });
  return Exam;
};