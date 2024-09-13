'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductImage.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  ProductImage.init({
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products', // name of the target model
        key: 'id' // key in the target model that we're referencing
      }
    },
    url: DataTypes.STRING(500)
  }, {
    sequelize,
    modelName: 'ProductImage',
  });
  return ProductImage;
};
