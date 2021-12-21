'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Homework', 'description', {
      type: Sequelize.TEXT
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Homework', 'description', {
      type: Sequelize.STRING
    })
  }
};
