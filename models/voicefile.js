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
      Voicefile.hasMany(models.Favorite)
      // Voicefile.hasMany(models.Like)
      Voicefile.belongsToMany(models.User, {
        through: models.Like,
        foreinKey: 'VoicefileId',
        as: 'LikedUsers'
      })
    }
  };
  Voicefile.init({
    name: DataTypes.STRING,
    googleFileId: DataTypes.STRING,
    likeCount: DataTypes.INTEGER,
    isPublic: DataTypes.BOOLEAN,
    HomeworkId: DataTypes.INTEGER,
    mimeType: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    ClassId: DataTypes.INTEGER,
    isFeedbackedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Voicefile',
    tableName: 'Voicefiles',
  });
  return Voicefile;
};