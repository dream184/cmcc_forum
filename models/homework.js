'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Homework extends Model {
    static associate(models) {
      Homework.belongsTo(models.Class)
    }
  };
  Homework.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    isPublic: DataTypes.BOOLEAN,
    expiredTime: DataTypes.DATE,
    ClassId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Homework',
  });
  return Homework;
};