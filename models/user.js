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
    }
  };
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.STRING,
    voiceAttribute: DataTypes.STRING,
    nickName: DataTypes.STRING,
    email: DataTypes.STRING,
    AuthorityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};