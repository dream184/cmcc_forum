'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      Feedback.belongsTo(models.User)
      Feedback.belongsTo(models.Voicefile)
    }
  };
  Feedback.init({
    feedback: DataTypes.TEXT,
    ranking: DataTypes.INTEGER,
    VoicefileId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    isMentor: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Feedback',
    tableName: 'Feedbacks'
  });
  return Feedback;
};