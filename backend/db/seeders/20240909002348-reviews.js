const { Review } = require('../models');
// const { faker } = require('@faker-js/faker');

'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const reviews = [
      {
        product_id: 1,
        user_id: 1,
        content: 'Amazing product! I love everything about it.',
      },
      {
        product_id: 1,
        user_id: 2,
        content: 'Great device, but the battery life could be better.',
      },
      {
        product_id: 1,
        user_id: 3,
        content: 'Good value for the price.',
      },
      {
        product_id: 1,
        user_id: 4,
        content: 'The camera quality is outstanding!',
      },
      {
        product_id: 1,
        user_id: 5,
        content: 'Very fast and responsive. Highly recommend.',
      },
      {
        product_id: 2,
        user_id: 1,
        content: 'Not what I expected. The quality is subpar.',
      },
      {
        product_id: 2,
        user_id: 2,
        content: 'Decent product, but there are better options available.',
      },
      {
        product_id: 2,
        user_id: 3,
        content: 'Satisfied with the purchase. Would recommend.',
      },
      {
        product_id: 2,
        user_id: 4,
        content: 'The camera is amazing, but the software has some bugs.',
      },
      {
        product_id: 2,
        user_id: 5,
        content: 'Battery life is excellent, but the design could be better.',
      },
      {
        product_id: 3,
        user_id: 1,
        content: 'Excellent product! Exceeded my expectations.',
      },
      {
        product_id: 3,
        user_id: 2,
        content: 'Works as advertised. Happy with the purchase.',
      },
      {
        product_id: 3,
        user_id: 3,
        content: 'Average product. Nothing special.',
      },
      {
        product_id: 3,
        user_id: 4,
        content: 'Great phone with a fantastic camera.',
      },
      {
        product_id: 3,
        user_id: 5,
        content: 'Good performance, but the battery life is just okay.',
      },
      {
        product_id: 4,
        user_id: 3,
        content: 'Impressive product. Exceeded my expectations.',
      },
      {
        product_id: 4,
        user_id: 4,
        content: 'Great features and reliable performance.',
      },
      {
        product_id: 4,
        user_id: 5,
        content: 'Good product, but there are some minor flaws.',
      },
      {
        product_id: 4,
        user_id: 6,
        content: 'The display is stunning and the performance is top-notch.',
      },
      {
        product_id: 4,
        user_id: 7,
        content: 'Very versatile and powerful tablet.',
      },
      {
        product_id: 5,
        user_id: 1,
        content: 'The screen is amazing, but it\'s a bit too large for my taste.',
      },
      {
        product_id: 5,
        user_id: 2,
        content: 'Great tablet for media consumption.',
      },
      {
        product_id: 5,
        user_id: 3,
        content: 'Battery life is fantastic, but it\'s quite heavy.',
      },
      {
        product_id: 5,
        user_id: 4,
        content: 'Excellent performance and build quality.',
      },
      {
        product_id: 5,
        user_id: 5,
        content: 'Perfect for productivity and entertainment.',
      },
      {
        product_id: 6,
        user_id: 1,
        content: 'Very powerful and versatile tablet.',
      },
      {
        product_id: 6,
        user_id: 2,
        content: 'Great for work and play.',
      },
      {
        product_id: 6,
        user_id: 3,
        content: 'The detachable keyboard is very convenient.',
      },
      {
        product_id: 6,
        user_id: 4,
        content: 'Excellent performance, but the battery life could be better.',
      },
      {
        product_id: 6,
        user_id: 5,
        content: 'Perfect for on-the-go productivity.',
      },
      {
        product_id: 7,
        user_id: 1,
        content: 'The new M2 chip is incredibly fast.',
      },
      {
        product_id: 7,
        user_id: 2,
        content: 'The display is stunning and the performance is top-notch.',
      },
      {
        product_id: 7,
        user_id: 3,
        content: 'Great laptop for professionals.',
      },
      {
        product_id: 7,
        user_id: 4,
        content: 'Very powerful and reliable.',
      },
      {
        product_id: 7,
        user_id: 5,
        content: 'The battery life is excellent.',
      },
      {
        product_id: 8,
        user_id: 1,
        content: 'The 4K OLED display is amazing.',
      },
      {
        product_id: 8,
        user_id: 2,
        content: 'Very powerful and sleek design.',
      },
      {
        product_id: 8,
        user_id: 3,
        content: 'Great laptop for gaming and productivity.',
      },
      {
        product_id: 8,
        user_id: 4,
        content: 'The build quality is excellent.',
      },
      {
        product_id: 8,
        user_id: 5,
        content: 'Very fast and responsive.',
      },
      {
        product_id: 9,
        user_id: 1,
        content: 'The 2-in-1 design is very convenient.',
      },
      {
        product_id: 9,
        user_id: 2,
        content: 'Great laptop for work and play.',
      },
      {
        product_id: 9,
        user_id: 3,
        content: 'The Intel Evo platform is very powerful.',
      },
      {
        product_id: 9,
        user_id: 4,
        content: 'Excellent performance and battery life.',
      },
      {
        product_id: 9,
        user_id: 5,
        content: 'Very versatile and reliable.',
      },
      {
        product_id: 10,
        user_id: 1,
        content: 'The health monitoring features are very advanced.',
      },
      {
        product_id: 10,
        user_id: 2,
        content: 'Great smartwatch with many useful features.',
      },
      {
        product_id: 10,
        user_id: 3,
        content: 'The crash detection feature is very useful.',
      },
      {
        product_id: 10,
        user_id: 4,
        content: 'Excellent build quality and performance.',
      },
      {
        product_id: 10,
        user_id: 5,
        content: 'Very stylish and functional.',
      },
    ];

    await Review.bulkCreate(reviews, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // Delete all reviews
    });
  }
};
