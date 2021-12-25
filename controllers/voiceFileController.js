const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
const db = require('../models')
const VoiceFile = db.Voicefile
const Homework = db.Homework
const Class = db.Class
const googleDrive = require('./google_drive_method')

dayjs.locale('zh-tw') 
dayjs.extend(utc)
dayjs.extend(timezone)

const voiceFileController = {
  postVoiceFile: (req, res) => {
    const { file } = req
    const now = dayjs()
    const nowTW = dayjs(now, "Asia/Taipei").valueOf()
    console.log(file)

    return Homework.findOne({
      where: {id: req.params.id },
      include: [Class, VoiceFile]
    })
      .then((homework) => {
        const homeworkJSON = homework.toJSON()
        const filename = `${homework.Class.name}_${homework.name}_${req.user.name}`
        if (homework.expiredTime < nowTW) {
          req.flash('error_messages', '已過繳交期限，無法上傳')
          return res.redirect('back')
        }

        if (file) {
          googleDrive.uploadVoiceFile(file, filename, homeworkJSON.googleFolderId).then((googleFileId) => {
            googleDrive.becomePublic(googleFileId).then((result) => {
              const { id, name, mimeType } = result
              return VoiceFile.create({
                name: name,
                googleFileId: id,
                mimeType: mimeType,
                HomeworkId: homework.id,
                isPublic: true,
                UserId: req.user.id
              })
                .then((voiceFile) => {
                  req.flash('success_messages', '音檔上傳成功！')
                  return res.redirect('back')
                })
                .catch((error) => {
                  req.flash('error_messages', '未選上傳音檔，上傳失敗')
                  console.log(error)
                  return res.redirect('back')
                })
            })
          })   
        } else {
          res.flash('error_messages', '未選上傳音檔，上傳失敗')
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
          req.flash('success_messages', '已成功刪除音檔')
          return res.redirect('back')
        })
    })   
  }
}

module.exports = voiceFileController