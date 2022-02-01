'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Authorities', [
      {
        id: 1,
        name: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'TA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'mentor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
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
