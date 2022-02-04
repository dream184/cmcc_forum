'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model { 
    static associate(models) {
      User.belongsTo(models.Authority)
      User.hasMany(models.AttendClass)
      User.hasMany(models.Voicefile)
      User.hasMany(models.Feedback)
      User.hasMany(models.Favorite)
      User.belongsToMany(models.Voicefile, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikedVoicefiles'
      })
      User.belongsToMany(models.Voicefile, {
        through: models.Favorite,
        foreignKey: 'UserId',
        as: 'FavoritedVoicefiles'
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.STRING,
    voiceAttribute: DataTypes.STRING,
    nickName: DataTypes.STRING,
    email: DataTypes.STRING,
    AuthorityId: DataTypes.INTEGER,
    googleImageId: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  });
  return User;
};