'use strict';

const { Rating } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const ratings = [
      {
        product_id: 1,
        user_id: 1,
        rating: 10, // Very positive review
      },
      {
        product_id: 1,
        user_id: 2,
        rating: 8, // Not too positive nor too critical
      },
      {
        product_id: 1,
        user_id: 3,
        rating: 10, // Not too positive nor too critical
      },
      {
        product_id: 1,
        user_id: 4,
        rating: 10, // Very positive review
      },
      {
        product_id: 1,
        user_id: 5,
        rating: 10, // Very positive review
      },
      {
        product_id: 2,
        user_id: 1,
        rating: 2, // Negative review
      },
      {
        product_id: 2,
        user_id: 2,
        rating: 5, // Not too positive nor too critical
      },
      {
        product_id: 2,
        user_id: 3,
        rating: 8, // Positive review
      },
      {
        product_id: 2,
        user_id: 4,
        rating: 6, // Not too positive nor too critical
      },
      {
        product_id: 2,
        user_id: 5,
        rating: 7, // Not too positive nor too critical
      },
      {
        product_id: 3,
        user_id: 1,
        rating: 9, // Very positive review
      },
      {
        product_id: 3,
        user_id: 2,
        rating: 8, // Positive review
      },
      {
        product_id: 3,
        user_id: 3,
        rating: 5, // Not too positive nor too critical
      },
      {
        product_id: 3,
        user_id: 4,
        rating: 8, // Positive review
      },
      {
        product_id: 3,
        user_id: 5,
        rating: 6, // Not too positive nor too critical
      },
      {
        product_id: 4,
        user_id: 3,
        rating: 9, // Very positive review
      },
      {
        product_id: 4,
        user_id: 4,
        rating: 8, // Positive review
      },
      {
        product_id: 4,
        user_id: 5,
        rating: 6, // Not too positive nor too critical
      },
      {
        product_id: 4,
        user_id: 6,
        rating: 9, // Very positive review
      },
      {
        product_id: 4,
        user_id: 7,
        rating: 8, // Positive review
      },
      {
        product_id: 5,
        user_id: 1,
        rating: 6, // Not too positive nor too critical
      },
      {
        product_id: 5,
        user_id: 2,
        rating: 8, // Positive review
      },
      {
        product_id: 5,
        user_id: 3,
        rating: 7, // Not too positive nor too critical
      },
      {
        product_id: 5,
        user_id: 4,
        rating: 9, // Very positive review
      },
      {
        product_id: 5,
        user_id: 5,
        rating: 9, // Very positive review
      },
      {
        product_id: 6,
        user_id: 1,
        rating: 8, // Positive review
      },
      {
        product_id: 6,
        user_id: 2,
        rating: 8, // Positive review
      },
      {
        product_id: 6,
        user_id: 3,
        rating: 7, // Not too positive nor too critical
      },
      {
        product_id: 6,
        user_id: 4,
        rating: 6, // Not too positive nor too critical
      },
      {
        product_id: 6,
        user_id: 5,
        rating: 8, // Positive review
      },
      {
        product_id: 7,
        user_id: 1,
        rating: 9, // Very positive review
      },
      {
        product_id: 7,
        user_id: 2,
        rating: 9, // Very positive review
      },
      {
        product_id: 7,
        user_id: 3,
        rating: 8, // Positive review
      },
      {
        product_id: 7,
        user_id: 4,
        rating: 9, // Very positive review
      },
      {
        product_id: 7,
        user_id: 5,
        rating: 9, // Very positive review
      },
      {
        product_id: 8,
        user_id: 1,
        rating: 9, // Very positive review
      },
      {
        product_id: 8,
        user_id: 2,
        rating: 9, // Very positive review
      },
      {
        product_id: 8,
        user_id: 3,
        rating: 8, // Positive review
      },
      {
        product_id: 8,
        user_id: 4,
        rating: 9, // Very positive review
      },
      {
        product_id: 8,
        user_id: 5,
        rating: 9, // Very positive review
      },
      {
        product_id: 9,
        user_id: 1,
        rating: 8, // Positive review
      },
      {
        product_id: 9,
        user_id: 2,
        rating: 8, // Positive review
      },
      {
        product_id: 9,
        user_id: 3,
        rating: 8, // Positive review
      },
      {
        product_id: 9,
        user_id: 4,
        rating: 9, // Very positive review
      },
      {
        product_id: 9,
        user_id: 5,
        rating: 9, // Very positive review
      },
      {
        product_id: 10,
        user_id: 1,
        rating: 9, // Very positive review
      },
      {
        product_id: 10,
        user_id: 2,
        rating: 9, // Very positive review
      },
      {
        product_id: 10,
        user_id: 3,
        rating: 9, // Very positive review
      },
      {
        product_id: 10,
        user_id: 4,
        rating: 9, // Very positive review
      },
      {
        product_id: 10,
        user_id: 5,
        rating: 9, // Very positive review
      },
    ];

    await Rating.bulkCreate(ratings, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Ratings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // Delete all ratings
    });
  }
};
