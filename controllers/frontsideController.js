const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw') 
const db = require('../models')
const Class = db.Class
const Homework = db.Homework
const VoiceFile = db.Voicefile

const frontsideController = {
  getClasses: (req, res) => {
    Class.findAll({ raw: true })
      .then((classes) => {
        return res.render('index', {
          classes: classes, layout: 'main'
        })
      })
  },
  getHomeworks: (req, res) => {
    return Class.findOne({
      where: {id: req.params.id},
      include: [Homework]
    })
      .then((selectedClass) => {
        return res.render('homeworks', { class: selectedClass.toJSON() })
      })
  },
  getHomework: (req, res) => {
    return Homework.findOne({
      where: {id: req.params.id},
      include: [Class, VoiceFile]
    })
      .then((homework) => {
        const homeworkJSON = homework.toJSON()
        homeworkJSON.Voicefiles.forEach(x => x.createdAt = dayjs(x.createdAt).format('YYYY/MM/DD HH:mm'))
        return res.render('homework', { 
          homework: homeworkJSON,
          
        })
      })

  }
}
module.exports = frontsideController