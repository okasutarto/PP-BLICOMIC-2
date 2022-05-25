'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Comic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Comic.init({
    totalPurchased: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    ComicId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_Comic',
  });
  return User_Comic;
};