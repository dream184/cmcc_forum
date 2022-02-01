'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User)
      Like.belongsTo(models.Voicefile)
    }
  };
  Like.init({
    UserId: DataTypes.INTEGER,
    VoicefileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
  });
  return Like;
};