'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Classes',
      Array.from({ length: 10}).map((d, i) => ({
        name: `聲音表達基礎班第${140 + i}期`,
        group: '聲音表達基礎班',
        image: 'https://picsum.photos/300/250/?random=1',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Classes', null, {})
  }
};
