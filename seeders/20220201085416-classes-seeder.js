'use strict';
require('dotenv').config()
const rootFolderId = process.env.GOOGLE_ROOT_FOLDER_ID
const googleDrive = require('../controllers/google_drive_method.js')
const { SEED_CLASSES, SEED_HOMEWORKS, file } = require('./sample/seed-data.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      for (const seedClass of SEED_CLASSES) {
        const classfolder = await googleDrive.createFolder(seedClass.name, rootFolderId)

        await queryInterface.bulkInsert('Classes', [{
          id: seedClass.id,
          name: seedClass.name,
          isPublic: true,
          image: seedClass.image,
          googleFolderId: classfolder.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }], {})

        for (const seedHomework of SEED_HOMEWORKS) {
          const homeworkFolder = await googleDrive.createFolder(seedHomework.name, classfolder.id)
          const homeworkId = await queryInterface.bulkInsert('Homeworks', [{
            name: seedHomework.name,
            isPublic: true,
            image: null,
            googleFolderId: homeworkFolder.id,
            description: seedHomework.description,
            ClassId: seedClass.id,
            expiredTime: new Date(2022, 12, 31),
            createdAt: new Date(),
            updatedAt: new Date()
          }], {})

          const googleFileId = await googleDrive.uploadVoiceFile(file, '種子檔', homeworkFolder.googleFolderId)
          const result = await googleDrive.becomePublic(googleFileId)
          const { id, name, mimeType } = result
          await queryInterface.bulkInsert('Voicefiles', [{
            name: name,
            googleFileId: id,
            mimeType: mimeType,
            HomeworkId: homeworkId,
            isPublic: true,
            UserId: 1,
            ClassId: seedClass.id,
            createdAt: new Date(),
            updatedAt: new Date()
          }], {})
        }
      }
    } catch (e) {
      console.warn(e)
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attendClasses', null, {})
    await queryInterface.bulkDelete('Voicefiles', null, {})
    await queryInterface.bulkDelete('Homeworks', null, {})
    await queryInterface.bulkDelete('Classes', null, {})
  }
};
