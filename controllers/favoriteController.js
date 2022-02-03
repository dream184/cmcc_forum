const { Favorite, Voicefile, User, Class, Homework } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const favoriteController = {
  getFavoriteVoicefiles: (req, res) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    let offset = getOffset(limit, page)
    return Favorite.findAndCountAll({
      offset,
      limit,
      where: {UserId: req.user.id},
      include: [
        { model: Voicefile, include: [User, Class, Homework] },
        User
      ]
    })
      .then((result) => {
        const data = result.rows.map(r => ({
          ...r.dataValues
        }))
        return res.render('favorite', {
          favorites: data,
          pagination: getPagination(limit, page, result.count)
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