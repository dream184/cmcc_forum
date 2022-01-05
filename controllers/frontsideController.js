const db = require('../models')
const Class = db.Class
const Homework = db.Homework
const VoiceFile = db.Voicefile
const User = db.User
const Like = db.Like
const Favorite = db.Favorite

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
        const user = req.user
        const userFavoritesArr = user.Favorites.map(e => e.VoicefileId)
        const userLikesArr = user.Likes.map(e => e.VoicefileId)
        return res.render('homework', { 
          homework: homework.toJSON(),
          userFavoritesArr: userFavoritesArr,
          userLikesArr: userLikesArr
        })
      })
  }
}
module.exports = frontsideController