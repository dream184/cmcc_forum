'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Voicefiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      googleFileId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      favoriteCount: {
        type: Sequelize.INTEGER
      },
      isPublic: {
        type: Sequelize.BOOLEAN
      },
      HomeworkId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'homework',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Voicefiles');
  }
};