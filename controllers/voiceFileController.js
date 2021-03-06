const { Voicefile, Homework, Class, User, AttendClass } = require('../models')
const Op = require('sequelize').Op
const googleDrive = require('../helpers/googleDriveHelpers')
const { dayjs } = require('../helpers/dayjsHelpers')
const { getOffset, getPagination } = require('../helpers/paginationHelper')
const { search } = require('../helpers/searchHelper')

const voiceFileController = {
  getVoiceFiles: (req, res) => {
    const type = req.query.type
    const keyword = req.query.keyword
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    let order = req.query.orderby || 'date-desc'
    const orderBy = {
      'date-asc': [['createdAt', 'ASC']],
      'date-desc': [['createdAt', 'DESC']],
      'classes': [['ClassId', 'DESC']],
      'homeworks': [['HomeworkId', 'DESC']],
      'authors': [['UserId', 'DESC']]
    }
    search(type, keyword)
      .then((searchResults) => {
        const where = type ? searchResults : {}
        Voicefile.findAndCountAll({
          offset,
          limit,
          raw: true,
          nest: true,
          order: orderBy[order],
          include: [
            User,
            Homework,
            Class
          ],
          where: where
        })
          .then((result) => {
            const data = result.rows
            return res.render('admin/voicefiles', {
              voicefiles: data,
              layout: 'admin',
              order: order,
              type,
              keyword,
              pagination: getPagination(limit, page, result.count)
            })
          })
          .catch((err) => console.log(err))
      })
  },
  getNoFeedbackVoicefiles: (req, res) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Voicefile.findAndCountAll({
      offset,
      limit,
      where: { isFeedbackedBy: {[Op.eq]: false} },
      raw: true,
      nest: true,
      include: [User, Homework, Class]
    })
      .then((result) => {
        const data = result.rows
        return res.render('admin/nofeedbackvoicefiles', {
          voicefiles: data,
          layout: 'admin',
          pagination: getPagination(limit, page, result.count)
        })
      }).catch((err) => console.log(err))
  },
  postVoiceFile: (req, res) => {
    const { file } = req
    const now = dayjs()
    const nowTW = dayjs(now, "Asia/Taipei").valueOf()

    if (!file) {
      res.flash('error_messages', '?????????????????????????????????')
      return res.redirect('back')
    }

    return Promise.all([
      Homework.findOne({
        where: { id: req.params.id },
        include: [ Class, Voicefile ]
      }),
      User.findByPk(req.user.id, {
        include: [{
          model: Class, as: 'AttendedClasses'
        }]
      })
    ])
      .then(([homework, user]) => {
        const AttendClasses = user.AttendedClasses
        const AttendClassArr = AttendClasses.map(e => e.id)
        const homeworkJSON = homework.toJSON()
        const filename = `${homework.Class.name}_${homework.name}_${req.user.name}`

        if (!AttendClassArr.includes(homework.ClassId)) {
          req.flash('error_messages', '????????????????????????????????????')
          return res.redirect('back')
        }
        if (homework.expiredTime < nowTW) {
          req.flash('error_messages', '?????????????????????????????????')
          return res.redirect('back')
        }
        return googleDrive.uploadVoiceFile(file, filename, homeworkJSON.googleFolderId)
          .then((googleFileId) => {
            return googleDrive.becomePublic(googleFileId)
          })
          .then((result) => {
            const { id, name, mimeType } = result
            return Voicefile.create({
              name: name,
              googleFileId: id,
              mimeType: mimeType,
              HomeworkId: homework.id,
              isPublic: true,
              UserId: req.user.id,
              ClassId: homeworkJSON.Class.id
            })
          })
          .then(() => {
            req.flash('success_messages', '?????????????????????')
            return res.redirect('back')
          })
          .catch((error) => {
            req.flash('error_messages', '?????????????????????????????????')
            console.log(error)
            return res.redirect('back')
          })
      })
  },
  deleteVoiceFile: (req, res) => {
    return Voicefile.findByPk(req.params.id)
      .then((voicefile) => {
        if (voicefile.UserId !== req.user.id) {
          req.flash('error_messages', '??????????????????????????????????????????')
          return res.redirect('back')
        }
        return voicefile.destroy()
          .then(() => {
            return googleDrive.deleteFile(voicefile.googleFileId)
          })
          .then(() => {
            req.flash('success_messages', '?????????????????????')
            return res.redirect('back')
          })
          .catch((err) => {
            req.flash('error_messages', '??????????????????')
            console.log(err)
            return res.redirect('back')
          })
      })
  }
}

module.exports = voiceFileController