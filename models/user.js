'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {




    //User.hasMany(models.Order,{foreignKey: 'userId'});


    //PRUEBA 51
      User.hasMany(models.Order);



    }
  }
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    gender: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    dni: DataTypes.INTEGER,
    phone: DataTypes.INTEGER,
    email: DataTypes.STRING,
    adress: DataTypes.STRING,
    key: DataTypes.STRING,
    location: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    rol: DataTypes.STRING,
    direction: DataTypes.STRING,
    diagnostic: DataTypes.STRING,
    pregnant: DataTypes.BOOLEAN,
  }, {
    sequelize,
    timestamps:true,
    modelName: 'User',
  });
  return User;
};