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
        through: models.User_Comic
      })
    }

    static sorting(input) {
      return [[input, 'DESC']]
    }
  }
  Comic.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: [0],
          msg: 'Min stock is 0'
        }

      }
    },
    genre: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Comic',
  });
  return Comic;
};