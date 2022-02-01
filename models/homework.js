'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Homework extends Model {
    static associate(models) {
      Homework.belongsTo(models.Class)
      Homework.hasMany(models.Voicefile)
    }
  };
  Homework.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    isPublic: DataTypes.BOOLEAN,
    expiredTime: DataTypes.DATE,
    ClassId: DataTypes.INTEGER,
    googleFolderId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Homework',
    tableName: 'Homeworks'
  });
  return Homework;
};