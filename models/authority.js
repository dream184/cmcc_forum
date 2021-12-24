'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Authority extends Model {
    static associate(models) {
      Authority.hasMany(models.User)
    }
  };
  Authority.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Authority',
  });
  return Authority;
};