'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.Product, { foreignKey: 'product_id' });
      Rating.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  };

  Rating.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 10
        }
      }
    },
    {
      sequelize,
      modelName: "Rating",
      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        }
      }
    }
  );
  return Rating;
};
