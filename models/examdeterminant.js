'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExamDeterminant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Asociación con Determinant
      //ExamDeterminant.belongsTo(models.Determinant);
      // Asociación con Exam
      //ExamDeterminant.belongsTo(models.Exam);
      //probando
      //ExamDeterminant.hasMany(models.Result);

      //ExamDeterminant.belongsTo(models.Exam, { foreignKey: 'examId' });
      //ExamDeterminant.belongsTo(models.Determinant, { foreignKey: 'determinantId' });
      //ExamDeterminant.hasMany(models.Result, { foreignKey: 'examDeterminantId' });



      //ExamDeterminant.belongsTo(models.OrderExam, { foreignKey: 'examId', targetKey: 'ExamId' });
      //ExamDeterminant.belongsTo(models.Determinant, { foreignKey: 'determinantId' });
      //ExamDeterminant.hasMany(models.Result, { foreignKey: 'examDeterminantId' });
/*
      ExamDeterminant.belongsTo(models.Exam);
      ExamDeterminant.belongsTo(models.Determinant);
      */
     // ExamDeterminant.hasMany(models.Result);
     


    //ExamDeterminant.belongsTo(models.Exam, { foreignKey: 'examId' });
    //ExamDeterminant.belongsTo(models.Determinant, { foreignKey: 'determinantId' });
    //ExamDeterminant.hasMany(models.Result, { foreignKey: 'examDeterminantId' });


     //funciona para ver los resultados, la ruta orders/:id
     // ExamDeterminant.belongsTo(models.Exam, { foreignKey: 'ExamId' });
      //ExamDeterminant.belongsTo(models.Determinant, { foreignKey: 'determinantId' });

      //prueba 51

    ExamDeterminant.belongsTo(models.Exam);
    ExamDeterminant.belongsTo(models.Determinant, { foreignKey: 'determinantId' });
    ExamDeterminant.hasMany(models.Result);
    }
  }
  ExamDeterminant.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    determinantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Determinant',
        key: 'id'
      }
    },
    ExamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Exam',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'ExamDeterminant',
  });
  return ExamDeterminant;
};