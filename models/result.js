'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    
    static associate(models) {
      //Result.belongsTo(models.ExamDeterminant);
      //Result.belongsTo(models.OrderExam, {foreignKey: 'orderExamId'});
      
      /*
      Result.belongsTo(models.OrderExam, {
        foreignKey: 'orderExamId',
        //onDelete: 'CASCADE',
      });
      Result.belongsTo(models.ExamDeterminant, {
        foreignKey: 'examDeterminantId', // Asegúrate de que el nombre de la clave foránea sea correcto
        //onDelete: 'CASCADE',
      });
      */


      //prueba 50
      //Result.belongsTo(models.OrderExam, { foreignKey: 'orderExamId' });
      //Result.belongsTo(models.ExamDeterminant, { foreignKey: 'examDeterminantId' });
    
    
    //PRUEBA 51
      Result.belongsTo(models.OrderExam, { foreignKey: 'orderExamId' });
      Result.belongsTo(models.ExamDeterminant, { foreignKey: 'examDeterminantId' });
    
    
    }
      
  }
    

  Result.init({
    orderExamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'OrderExams', // Verifica que el nombre del modelo sea correcto
        key: 'id',
      },
    },
    examDeterminantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ExamDeterminants', // Verifica que el nombre del modelo sea correcto
        key: 'id',
      },
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Result',
  });

  return Result;
};
