'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.changeColumn('feedbacks', 'UserId', {
       type: Sequelize.INTEGER,
       references: {
         model: 'Users',
         key: 'id'
       }
     })
    await queryInterface.changeColumn('feedbacks', 'VoicefileId', {
       type: Sequelize.INTEGER,
       references: {
         model: 'Voicefiles',
         key: 'id'
       }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('feedbacks', 'UserId', {
       type: Sequelize.INTEGER,
    })
    await queryInterface.changeColumn('feedbacks', 'VoicefileId', {
       type: Sequelize.INTEGER,
    })
  }
};
