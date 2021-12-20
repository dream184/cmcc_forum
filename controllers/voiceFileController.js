const { google } = require('googleapis')
const db = require('../models')
const VoiceFile = db.Voicefile
const Homework = db.Homework
const Class = db.Class
const googleDrive = require('./google_drive_method')

const voiceFileController = {
  postVoiceFile: (req, res) => {
    const { file } = req

    return Homework.findOne({
      where: {id: req.params.id },
      include: [Class, VoiceFile]
    })
      .then((homework) => {
        const homeworkJSON = homework.toJSON()
        if (file) {
          googleDrive.uploadVoiceFile(file, file.originalname, homeworkJSON.googleFolderId).then((googleFileId) => {
            googleDrive.becomePublic(googleFileId).then((result) => {
              const { id, name, mimeType } = result
              return VoiceFile.create({
                name: name,
                googleFileId: id,
                mimeType: mimeType,
                HomeworkId: homework.id,
                isPublic: true,
              })
                .then((voiceFile) => {
                  return res.redirect(`/classes/${homework.Class.id}/homeworks/${homework.id}`)
                })
            })
          })   
        } else {
          console.log('error')
          return res.redirect('back')
        }
      })
  },
  deleteVoiceFile: (req, res) => {
    return VoiceFile.findByPk(req.params.id).then((voicefile) => {
      voicefile.destroy().then(() => {
        googleDrive.deleteFile(voicefile.googleFileId)
      })
        .then(() => {
          return res.redirect('back')
        })
    })   
  }
}

module.exports = voiceFileController