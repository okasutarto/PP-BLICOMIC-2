'use strict';

const bcrypt = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Comic, {
        through: models.User_Comic
      }),
        User.hasOne(models.Profile)
    }
  }
  User.init({
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Username is required"
        }
      }
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Email is required"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Password is required"
        }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (instance, options) => {
        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(instance.password, salt)

        instance.password = hash
        if (instance.userName === 'admin') {
          instance.role = "admin"
        } else if (instance.userName !== 'admin') {
          instance.role = "user"
        }
      }
    }
  });
  return User;
};