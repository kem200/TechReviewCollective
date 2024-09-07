'use strict';

const { ProductImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ProductImages';  // Specify the table name in options

    await ProductImage.bulkCreate([
      { product_id: 1, url: 'https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111846_sp875-sp876-iphone14-pro-promax.png' },
      { product_id: 2, url: 'https://image-us.samsung.com/us/smartphones/galaxy-s23-ultra/images/gallery/SkyBlue/1.jpg?$product-details-jpg$' },
      { product_id: 3, url: 'https://m.media-amazon.com/images/I/61bFypVJVyL.jpg' },
      { product_id: 4, url: 'https://cdn.shoplightspeed.com/shops/638151/files/49768398/image.jpg' },
      { product_id: 5, url: 'https://m.media-amazon.com/images/I/61f41zCQfKL.jpg' },
      { product_id: 6, url: 'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/surface-pro-9-sizzel-most-powerful-pro_tbmnl_en-us?scl=1', },
      { product_id: 7, url: 'https://www.apple.com/newsroom/images/product/mac/standard/Apple-MacBook-Pro-M2-Pro-and-M2-Max-hero-230117_Full-Bleed-Image.jpg.large.jpg' },
      { product_id: 8, url: 'https://m.media-amazon.com/images/I/719CAihgtTL.jpg' },
      { product_id: 9, url: 'https://www.techspot.com/images/products/2020/laptops/org/2023-12-18-product-2-j_1100.webp' },
      { product_id: 10, url: 'https://crdms.images.consumerreports.org/prod/products/cr/models/407606-smartwatches-apple-watch-series-8-gps-45mm-10032324.png' }
    ], { validate: true });  // Include validation to ensure data integrity
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ProductImages';  // Specify the table name in options
    return queryInterface.bulkDelete(options, null, {});
  }
};
