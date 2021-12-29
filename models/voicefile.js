'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voicefile extends Model {
    static associate(models) {
      Voicefile.belongsTo(models.Homework)
      Voicefile.belongsTo(models.Class)
      Voicefile.belongsTo(models.User)
      Voicefile.hasMany(models.Feedback)
    }
  };
  Voicefile.init({
    name: DataTypes.STRING,
    googleFileId: DataTypes.STRING,
    favoriteCount: DataTypes.INTEGER,
    isPublic: DataTypes.BOOLEAN,
    HomeworkId: DataTypes.INTEGER,
    mimeType: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    ClassId: DataTypes.INTEGER,
    isFeedbackedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Voicefile',
  });
  return Voicefile;
};