'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voicefile extends Model {
    static associate(models) {
      Voicefile.belongsTo(models.Homework)
      Voicefile.belongsTo(models.User)
    }
  };
  Voicefile.init({
    name: DataTypes.STRING,
    googleFileId: DataTypes.STRING,
    favoriteCount: DataTypes.INTEGER,
    isPublic: DataTypes.BOOLEAN,
    HomeworkId: DataTypes.INTEGER,
    mimeType: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Voicefile',
  });
  return Voicefile;
};