'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Voicefiles', 'isFeedbackedBy', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Voicefiles', 'isFeedbackedBy')
  }
};
