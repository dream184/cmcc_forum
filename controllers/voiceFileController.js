const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
const db = require('../models')
const VoiceFile = db.Voicefile
const Homework = db.Homework
const Class = db.Class
const User = db.User
const AttendClass = db.AttendClass
const googleDrive = require('./google_drive_method')
const Op = require('sequelize').Op
const pageLimit = 15

dayjs.locale('zh-tw') 
dayjs.extend(utc)
dayjs.extend(timezone)

const voiceFileController = {
  getVoiceFiles: (req, res) => {
    let offset = 0
    let order = req.params.orderby || 'date-desc'
    const orderBy = {
      'date-asc': [['createdAt', 'ASC']],
      'date-desc': [['createdAt', 'DESC']],
      'classes': [['ClassId', 'DESC']],
      'homeworks': [['HomeworkId', 'DESC']],
      'authors': [['UserId', 'DESC']]
    }
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.order) {
      order = req.query.order
    }
    return VoiceFile.findAndCountAll({   
      offset: offset,
      limit: pageLimit,
      raw: true,
      nest: true,
      order: orderBy[order],
      include: [
        User,
        Homework,
        Class
      ]
    })
      .then((result) => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1
        const data = result.rows
        return res.render('admin/voicefiles', {
          voicefiles: data,
          layout: 'admin',
          order: order,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
  },
  getNoFeedbackVoicefiles: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    return VoiceFile.findAndCountAll({
      offset: offset,
      limit: pageLimit,
      where: { isFeedbackedBy: {[Op.eq]: false} },
      raw: true,
      nest: true,
      include: [User, Homework, Class]
    })
      .then((result) => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1
        const data = result.rows
        return res.render('admin/nofeedbackvoicefiles', {
          voicefiles: data,
          layout: 'admin',
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      }).catch((err) => console.log(err))
  },
  postVoiceFile: (req, res) => {
    const { file } = req
    const now = dayjs()
    const nowTW = dayjs(now, "Asia/Taipei").valueOf()

    if (!file) {
      res.flash('error_messages', '未選上傳音檔，上傳失敗')
      return res.redirect('back')
    }

    return Promise.all([
      Homework.findOne({
        where: { id: req.params.id },
        include: [ Class, VoiceFile ]
      }),
      User.findByPk(req.user.id, {
        include: [ AttendClass ],
      })
    ])
      .then(([homework, user]) => {
        const AttendClasses = user.AttendClasses
        const AttendClassArr = AttendClasses.map(e => e.ClassId)
        const homeworkJSON = homework.toJSON()
        const filename = `${homework.Class.name}_${homework.name}_${req.user.name}`

        if (!AttendClassArr.includes(homework.ClassId)) {
          req.flash('error_messages', '您未加入此班級，無法上傳')
          return res.redirect('back')
        }
        if (homework.expiredTime < nowTW) {
          req.flash('error_messages', '已過繳交期限，無法上傳')
          return res.redirect('back')
        }
        return googleDrive.uploadVoiceFile(file, filename, homeworkJSON.googleFolderId)
          .then((googleFileId) => {
            return googleDrive.becomePublic(googleFileId)
              .then((result) => {
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
                    console.log(error)
                    return res.redirect('back')
                  })
              })
          })   
      })
  },
  deleteVoiceFile: (req, res) => {
    return VoiceFile.findByPk(req.params.id).then((voicefile) => {
      return User.findByPk(voicefile.UserId).then((user) => {
        if (user.id !== req.user.id) {
          req.flash('error_messages', '您不是作者本人，無法刪除音檔')
          return res.redirect('back')
        }
        voicefile.destroy().then(() => {
          googleDrive.deleteFile(voicefile.googleFileId)
        })
          .then(() => {
            req.flash('success_messages', '已成功刪除音檔')
            return res.redirect('back')
          })
          .catch((err) => {
            req.flash('error_messages', '無法刪除音檔')
            console.log(err)
            return res.redirect('back')
          })
      })
    })   
  }
}

module.exports = voiceFileController