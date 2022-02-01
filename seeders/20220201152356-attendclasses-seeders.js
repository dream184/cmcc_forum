'use strict';
const { SEED_ATTENDCLASSES } = require('./sample/seed-data.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Attendclasses', SEED_ATTENDCLASSES)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Attendclasses', null, {})
  }
};
