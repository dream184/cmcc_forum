'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('voicefiles', 'favoriteCount', 'likeCount')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('voicefiles', 'likeCount', 'favoriteCount')
  }
};
