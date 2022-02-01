'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'admin',
      email: 'admin@cmcc-forum.com',
      password: await bcrypt.hash('12345678', 10),
      AuthorityId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'mentor',
      email: 'mentor@cmcc-forum.com',
      password: await bcrypt.hash('12345678', 10),
      AuthorityId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'student',
      email: 'student@cmcc-forum.com',
      password: await bcrypt.hash('12345678', 10),
      AuthorityId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
