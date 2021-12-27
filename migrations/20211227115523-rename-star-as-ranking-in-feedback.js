'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('feedbacks', 'star', 'ranking')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('feedbacks', 'ranking', 'star')
  }
};
