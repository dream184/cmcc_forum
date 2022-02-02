const { Favorite, Voicefile, User, Class, Homework } = require('../models')
const pageLimit = 10

const favoriteController = {
  getFavoriteVoicefiles: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    Favorite.findAndCountAll({
      offset: offset,
      limit: pageLimit,
      where: {UserId: req.user.id},
      include: [
        { model: Voicefile, include: [User, Class, Homework] },
        User
      ] 
    })
      .then((result) => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1
        const data = result.rows.map(r => ({
          ...r.dataValues
        }))
        return res.render('favorite', {
          favorites: data,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
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