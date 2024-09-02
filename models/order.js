/*'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    
    static associate(models) {
      Order.belongsTo(models.User);
      Order.belongsToMany(models.Exam, { through: models.OrderExam });
      Order.belongsToMany(models.Sample, { through: models.OrderSample });
    }
  }
  Order.init({
    state: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
*/







'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {






    static associate(models) {

      //funciona para ver los resultados, la ruta orders/:id
      //Order.belongsTo(models.User, { foreignKey: 'userId' });
      //Order.belongsToMany(models.Exam, { through: models.OrderExam });

      //Order.hasMany(models.OrderExam, { foreignKey: 'orderId' });




      //funciona para ver los examens de cada orden
      //Order.belongsToMany(models.Exam, { through: models.OrderExam}); //muchos a muchos
      //Order.belongsToMany(models.Sample, { through: models.OrderSample }); //muchos a muchos

      /*
      Order.belongsToMany(models.Exam, { through: models.OrderExam, foreignKey: 'orderId'}); //muchos a muchos
      //Order.belongsToMany(models.Sample, { through: models.OrderSample }); //muchos a muchos





      //prueba 50
      Order.hasMany(models.OrderExam); // Add this line
*/




      //PRUEBA 51
        Order.belongsTo(models.User);
        Order.hasMany(models.OrderExam);
      





        //asociacion con examenes
        Order.belongsToMany(models.Exam, { through: models.OrderExam });
    }





  }

  Order.init({
    state: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    fechaIngreso: DataTypes.DATE, // Añade las nuevas columnas
    fechaEntregaResultados: DataTypes.DATE, // Añade las nuevas columnas
    diagnostic: DataTypes.STRING,
    observations: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};
