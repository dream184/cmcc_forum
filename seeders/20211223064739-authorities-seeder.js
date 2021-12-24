'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Authorities', [
      {
        name: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'TA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'mentor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Authorities', null, {})
  }
};
