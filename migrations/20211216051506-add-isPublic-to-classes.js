'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('classes', 'isPublic', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('classes', 'isPublic')
  }
};
