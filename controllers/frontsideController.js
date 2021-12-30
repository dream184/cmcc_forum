const db = require('../models')
const Class = db.Class
const Homework = db.Homework
const VoiceFile = db.Voicefile
const User = db.User

const frontsideController = {
  getClasses: (req, res) => {
    Class.findAll({
      where: {isPublic: true},
      raw: true 
    })
      .then((classes) => {
        return res.render('index', {
          classes: classes
        })
      })
  },
  getHomeworks: (req, res) => {
    return Class.findOne({
      where: {
        id: req.params.id,
        isPublic: true
      },
      include: [Homework]
    })
      .then((selectedClass) => {
        return res.render('homeworks', { class: selectedClass.toJSON() })
      })
  },
  getHomework: (req, res) => {
    return Homework.findOne({
      where: {id: req.params.id},
      include: [
        Class, 
        { model: VoiceFile, include: [User] }
      ]
    })
      .then((homework) => {
        return res.render('homework', { 
          homework: homework.toJSON(),
        })
      })
  }
}
module.exports = frontsideController