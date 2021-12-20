const res = require('express/lib/response')
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
        console.log(homework)
        return res.render('homework', { homework: homework.toJSON()})
      })

  }
}
module.exports = frontsideController