const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
const db = require('../models')
const VoiceFile = db.Voicefile
const Homework = db.Homework
const Class = db.Class
const User = db.User
const Feedback = db.Feedback
const AttendClass = db.AttendClass
const googleDrive = require('./google_drive_method')
const Op = require('sequelize').Op

dayjs.locale('zh-tw') 
dayjs.extend(utc)
dayjs.extend(timezone)

const voiceFileController = {
  getVoiceFiles: (req, res) => {
    return VoiceFile.findAll({   
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [
        User,
        Homework,
        Class
      ]
    })
      .then((voicefiles) => {
        console.log(voicefiles)
        return res.render('admin/voicefiles', {
          voicefiles: voicefiles,
          layout: 'admin'
        })
      })
  },
  getVoiceFilesByOrder: (req, res) => {
    const order = req.params.orderby
    console.log(order)
    function orderby(order) {
      if (order === 'date-asc') return [['createdAt', 'ASC']]
      if (order === 'date-desc') return [['createdAt', 'DESC']]
      if (order === 'classes') return [['ClassId', 'DESC']]
      if (order === 'homeworks') return [['HomeworkId', 'DESC']]
      if (order === 'authors') return [['UserId', 'DESC']]
    }
    return VoiceFile.findAll({
      raw: true,
      nest: true,
      order: orderby(order),
      include: [
        User,
        Homework,
        Class
      ]
    })
      .then((voicefiles) => {
        console.log(voicefiles)
        return res.render('admin/voicefiles', {
          voicefiles: voicefiles,
          layout: 'admin'
        })
      })


  },
  getNoFeedbackVoicefiles: (req, res) => {
    return VoiceFile.findAll({
      where: { isFeedbackedBy: {[Op.is]: false} },
      raw: true,
      nest: true,
      include: [User, Homework, Class]
    })
      .then((voicefiles) => {
        console.log(voicefiles)
        return res.render('admin/nofeedbackvoicefiles', {
          voicefiles: voicefiles,
          layout: 'admin'
        })
      }).catch((err) => console.log(err))
  },
  postVoiceFile: (req, res) => {
    const { file } = req
    const now = dayjs()
    const nowTW = dayjs(now, "Asia/Taipei").valueOf()

    return Homework.findOne({
      where: {id: req.params.id },
      include: [Class, VoiceFile]
    }).then((homework) => {
      User.findByPk(req.user.id, {
        include: [AttendClass],
      }).then((user) => {
        const AttendClasses = user.AttendClasses
        const AttendClassArr = AttendClasses.map(e => e.ClassId)
        if (!AttendClassArr.includes(homework.ClassId)) {
          req.flash('error_messages', '您未加入此班級，無法上傳')
          return res.redirect('back')
        }
      })
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
              UserId: req.user.id,
              ClassId: homeworkJSON.Class.id
            })
              .then((voiceFile) => {
                req.flash('success_messages', '音檔上傳成功！')
                return res.redirect('back')
              })
              .catch((error) => {
                req.flash('error_messages', '未選上傳音檔，上傳失敗')
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