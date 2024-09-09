const { User } = require('../models');
const bcrypt = require("bcryptjs");
const { faker } = require('@faker-js/faker');

'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [
      {
      email: 'demo@user.io',
      username: 'demo',
      hashedPassword: bcrypt.hashSync('password'),
      bio: 'Technology is my passion',
      display_name: faker.person.fullName()
      },
      {
      email: 'kem@techreviewcollective.com',
      username: 'kem200',
      hashedPassword: bcrypt.hashSync('password'),
      bio: "Love reviewing good tech!",
      display_name: 'Kem'
      },
      {
      email: 'user1@example.com',
      username: 'user1',
      hashedPassword: bcrypt.hashSync('password'),
      bio: 'Enthusiastic tech reviewer',
      display_name: faker.person.fullName()
      },
      {
      email: 'user2@example.com',
      username: 'user2',
      hashedPassword: bcrypt.hashSync('password'),
      bio: 'Passionate about technology',
      display_name: faker.person.fullName()
      },
      {
      email: 'user3@example.com',
      username: 'user3',
      hashedPassword: bcrypt.hashSync('password'),
      bio: 'Tech lover and reviewer',
      display_name: faker.person.fullName()
      },
      {
      email: 'user4@example.com',
      username: 'user4',
      hashedPassword: bcrypt.hashSync('password'),
      bio: 'Exploring the world of tech',
      display_name: faker.person.fullName()
      },
      {
      email: 'user5@example.com',
      username: 'user5',
      hashedPassword: bcrypt.hashSync('password'),
      bio: 'Tech enthusiast and reviewer',
      display_name: faker.person.fullName()
      },
      {
      email: 'user6@example.com',
      username: 'user6',
      hashedPassword: bcrypt.hashSync('password'),
      bio: 'Sharing my tech experiences',
      display_name: faker.person.fullName()
      },
      {
      email: 'user7@example.com',
      username: 'user7',
      hashedPassword: bcrypt.hashSync('password'),
      bio: 'Tech geek and reviewer',
      display_name: faker.person.fullName()
      },
      {
      email: 'user8@example.com',
      username: 'user8',
      hashedPassword: bcrypt.hashSync('password'),
      bio: 'Reviewing the latest tech trends',
      display_name: faker.person.fullName()
      }
    ];

    await User.bulkCreate(users, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
