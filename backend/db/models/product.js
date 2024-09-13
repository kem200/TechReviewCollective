'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {

    static associate(models) {
      // define association here
      Product.hasMany(models.ProductImage, {
        foreignKey: 'product_id',
        as: 'images'
      });
      Product.hasMany(models.Rating, {
        foreignKey: 'product_id',
        as: 'ratings'
      });
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    category_id: DataTypes.INTEGER,
    brand: DataTypes.STRING,
    model_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
