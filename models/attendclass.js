'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AttendClass extends Model {
    static associate(models) {
      AttendClass.belongsTo(models.Class)
      AttendClass.belongsTo(models.User)
    }
  };
  AttendClass.init({
    ClassId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AttendClass',
  });
  return AttendClass;
};