const { Favorite, Voicefile, User, Class, Homework } = require('../models')
const { getOffset, getPagination } = require('../helpers/paginationHelper')

const favoriteController = {
  getFavoriteVoicefiles: (req, res) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    let offset = getOffset(limit, page)
    const user = req.user
    const favoritedVoicefilesArr = user.FavoritedVoicefiles.map(e => e.id)
  
    return Voicefile.findAndCountAll({
      offset,
      limit,
      where: { id: favoritedVoicefilesArr },
      include: [User, Class, Homework]
    })
      .then((result) => {
        const data = result.rows.map(r => ({
          ...r.dataValues
        }))
        return res.render('favorite', {
          favoritedVoicefiles: data,
          pagination: getPagination(limit, page, result.count)
        })
      })
      .catch(err => console.log(err))
  },
  addFavoriteVoicefile: (req, res) => {
    const voicefileId = req.params.id
    return Promise.all([
      Favorite.findOne({
        where: {
          VoicefileId: voicefileId,
          UserId: req.user.id
        }
      }),
      Voicefile.findByPk(voicefileId)
    ])
      .then(([favorite, voicefile]) => {
        if (favorite) {
          req.flash('error_messages', '已經加入收藏')
          return res.redirect('back')
        }
        if (!voicefile) {
          req.flash('error_messages', '該音檔不存在')
          return res.redirect('back')
        }
        return Favorite.create({
          VoicefileId: voicefileId,
          UserId: req.user.id
        })
      })
      .then(() => {
        req.flash('success_messages', '已成功加入收藏')
        return res.redirect('back')
      })
      .catch(err => {
        req.flash('error_messages', '無法加入收藏')
        console.log(err)
        return res.redirect('back')
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
      })
      .then(() => {
        req.flash('success_messages', '已成功移除收藏')
        return res.redirect('back')
      })
      .catch(err => {
        req.flash('error_messages', '無法移除收藏')
        console.log(err)
        return res.redirect('back')
      })
  }
}

module.exports = favoriteController