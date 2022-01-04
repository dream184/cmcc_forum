const db = require('../models')
const Favorite = db.Favorite
const Voicefile = db.Voicefile
const User = db.User
const Class = db.Class
const Homework = db.Homework

const favoriteController = {
  getFavoriteVoicefiles: (req, res) => {
    Favorite.findAll({
      raw: true,
      nest: true,
      where: {UserId: req.user.id},
      include: [
        { model: Voicefile, include: [User, Class, Homework] },
        User] 
    })
      .then((favorites) => {
        return res.render('favorite', { favorites: favorites })
      })
      .catch(err => console.log(err))
  },
  addFavoriteVoicefile: (req, res) => {
    const voicefileId = req.params.id
    return Favorite.findOne({
      where: {
        VoicefileId: voicefileId,
        UserId: req.user.id
      }
    })
      .then((favorite) => {
        if (favorite) {
          req.flash('error_messages', '已經加入收藏')
          return res.redirect('back')
        }
        return Favorite.create({
          VoicefileId: voicefileId,
          UserId: req.user.id
        })
          .then(() => {
            req.flash('success_messages', '已成功加入收藏')
            return res.redirect('back')
          })
          .catch(err => console.log(err))
      })  
  },
  removeFavoriteVoicefile: (req, res) => {
    const voicefileId = req.params.id
    return Favorite.findOne({
      where: {
        VoicefileId: voicefileId,
        UserId: req.user.id
      }
    })
      .then((favorite) => {
        favorite.destroy()
        req.flash('success_messages', '已成功移除收藏')
        return res.redirect('back')
      })
  }
}

module.exports = favoriteController