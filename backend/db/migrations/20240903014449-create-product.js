'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
      },
      name: {
      type: Sequelize.STRING,
      unique: true
      },
      description: {
      type: Sequelize.TEXT
      },
      category: {
      type: Sequelize.STRING
      },
      brand: {
      type: Sequelize.STRING
      },
      model_number: {
      type: Sequelize.STRING,
      unique: true
      },
      createdAt: {
      allowNull: false,
      type: Sequelize.DATE
      },
      updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
