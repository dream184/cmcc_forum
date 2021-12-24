'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'AuthorityId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'authorities',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'AuthorityId')
  }
};
