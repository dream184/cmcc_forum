'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Voicefiles', 'ClassId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'classes',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Voicefiles', 'ClassId')
  }
};
