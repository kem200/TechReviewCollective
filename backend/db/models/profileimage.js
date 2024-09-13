'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProfileImage extends Model {
    static associate(models) {
      // Define association here
      ProfileImage.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  };

  ProfileImage.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          isUrl: true
        }
      }
    },
    {
      sequelize,
      modelName: "ProfileImage",
      tableName: "ProfileImages"
    }
  );
  return ProfileImage;
};
