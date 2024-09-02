
/*

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderExam extends Model {



    static associate(models) {
      //funcion a para los resultados



      // Un OrderExam pertenece a una Order
      // OrderExam.belongsTo(models.Order, { foreignKey: 'orderId' });

      // Un OrderExam pertenece a un Exam
      //OrderExam.belongsTo(models.Exam, { foreignKey: 'ExamId' });

      // Un OrderExam tiene muchos Results
      //OrderExam.hasMany(models.Result, { foreignKey: 'orderExamId' });
      // OrderExam.hasOne(models.Result, { foreignKey: 'orderExamId' });
      
           //prueba 50
           //OrderExam.belongsTo(models.Order, { foreignKey: 'orderId' });
           //OrderExam.belongsTo(models.Exam, { foreignKey: 'examId' });
           //OrderExam.hasMany(models.Result, { foreignKey: 'orderExamId' });
      



      //OrderExam.belongsTo(models.Exam, { foreignKey: 'ExamId' });
      //OrderExam.hasMany(models.Result, { foreignKey: 'orderExamId' });

      //OrderExam.hasMany(models.Result, { foreignKey: 'orderExamId' });
      //OrderExam.belongsTo(models.Order, { foreignKey: 'orderId' });
      //OrderExam.belongsTo(models.Exam, { foreignKey: 'examId' });

      //PRUEBA 51


      OrderExam.belongsTo(models.Order);
      OrderExam.belongsTo(models.Exam);
      OrderExam.hasMany(models.Result);

    }

  }
  OrderExam.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    examId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Exams',
        key: 'id',
      },
      onDelete: 'CASCADE', 
    },
    orderId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
},
  }, { sequelize, modelName: 'OrderExam' });
  return OrderExam;
};
*/




'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class OrderExam extends Model {
    static associate(models) {
      // Un OrderExam pertenece a una Order
      OrderExam.belongsTo(models.Order, { foreignKey: 'orderId' });

      // Un OrderExam pertenece a un Exam
      OrderExam.belongsTo(models.Exam, { foreignKey: 'examId' });

      // Un OrderExam tiene muchos Results
      OrderExam.hasMany(models.Result, { foreignKey: 'orderExamId' });
    }
  }

  OrderExam.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    examId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Exams',
        key: 'id',
      },
      onDelete: 'CASCADE', 
    },
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'OrderExam',
  });

  return OrderExam;
};
