'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comic.belongsToMany(models.User, {
        through: models.User_Comics
      })
    }
  }
  Comic.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    genre: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Comic',
  });
  return Comic;
};