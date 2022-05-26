'use strict';

// Importing pict-url's module
const pictURL = require('pict-url');

// Getting the default Provider
const Imgur = pictURL.Provider.Imgur;

// Creating a basic new Client instance
const Client = new pictURL.Client(Imgur);

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User)
    }
  }
  Profile.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "First Name is required"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Last Name is required"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Address is required"
        }
      }
    },
    avatar: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
    hooks: {
      beforeCreate: (instance) => {
        let category = "doggos";
        Client.getImage(category)
          .then((image) => {

            // Image is a basic object
            instance.avatar = image.url;
            console.log(instance.avatar)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  });
  return Profile;
};