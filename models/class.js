'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.hasMany(models.Homework)
      Class.hasMany(models.AttendClass)
    }
  };
  Class.init({
    name: DataTypes.STRING,
    group: DataTypes.STRING,
    image: DataTypes.STRING,
    googleFolderId: DataTypes.STRING,
    isPublic: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Class',
  });
  return Class;
};