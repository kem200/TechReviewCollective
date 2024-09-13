'use strict';

const { Product } = require('../models');
const category = require('../models/category');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Product.bulkCreate([
      {
        name: 'iPhone 14 Pro Max',
        description: 'The latest flagship iPhone with A16 Bionic chip and 48MP camera.',
        category_id: 1,
        brand: 'Apple',
        model_number: 'MQ9R3LL/A',
      },
      {
        name: 'Galaxy S23 Ultra',
        description: 'The latest flagship from Samsung featuring a 200MP camera and Snapdragon 8 Gen 2.',
        category_id: 1,
        brand: 'Samsung',
        model_number: 'SM-S918BZKEXAA',
      },
      {
        name: 'Pixel 7 Pro',
        description: 'Google’s flagship phone with Tensor G2 chip and advanced AI camera capabilities.',
        category_id: 1,
        brand: 'Google',
        model_number: 'GA03461-US',
      },
      {
        name: 'iPad Pro 12.9-inch (6th Generation)',
        description: 'Apple’s most advanced tablet featuring M2 chip and Liquid Retina XDR display.',
        category_id: 11,
        brand: 'Apple',
        model_number: 'MNXT3LL/A',
      },
      {
        name: 'Tab S8 Ultra',
        description: 'Samsung’s flagship tablet with a 14.6-inch Super AMOLED display and Snapdragon 8 Gen 1.',
        category_id: 11,
        brand: 'Samsung',
        model_number: 'SM-X900NZAAXAR',
      },
      {
        name: 'Surface Pro 9',
        description: 'A high-performance tablet with Intel 12th Gen processors and a detachable keyboard.',
        category_id: 11,
        brand: 'Microsoft',
        model_number: 'QEZ-00001',
      },
      {
        name: 'MacBook Pro 16-inch (2023)',
        description: 'The new MacBook Pro with M2 Max chip and a Liquid Retina XDR display.',
        category_id: 2,
        brand: 'Apple',
        model_number: 'MK1H3LL/A',
      },
      {
        name: 'XPS 15 (9520)',
        description: 'Dell’s flagship laptop with a 12th Gen Intel Core i9 and a 15.6-inch 4K OLED display.',
        category_id: 2,
        brand: 'Dell',
        model_number: 'XPS9520-8417SLV-PUS',
      },
      {
        name: 'Spectre x360 14',
        description: 'HP’s premium 2-in-1 laptop with Intel Evo platform and 11th Gen Intel Core i7.',
        category_id: 2,
        brand: 'HP',
        model_number: '14-ea1047nr',
      },
      {
        name: 'Watch Series 8',
        description: 'Apple’s latest smartwatch with advanced health monitoring features and crash detection.',
        category_id: 12,
        brand: 'Apple',
        model_number: 'MNP13LL/A',
      },
    ], { validate: true });  // Use validation
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Products';  // Specify the table name in options
    return queryInterface.bulkDelete('Products', null, {});
  }
};
