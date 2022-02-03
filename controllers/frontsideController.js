const { Class, Homework, Voicefile, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

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
      .catch(err => console.log(err))
  },
  getHomework: (req, res) => {
    const DEFAULT_LIMIT = 1
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Homework.findOne({
      where: {id: req.params.id},
      include: [Class]
    })
      .then((homework) => {
        Voicefile.findAndCountAll({   
          where: { HomeworkId: homework.id },
          include: [User],
          offset,
          limit,
          order: [['createdAt', 'DESC']]
        })
          .then((result) => {
            const data = result.rows.map(r => ({
              ...r.dataValues
            }))
            const user = req.user
            const userFavoritesArr = user.Favorites.map(e => e.VoicefileId)
            const userLikesArr = user.Likes.map(e => e.VoicefileId)
            return res.render('homework', { 
              homework: homework.toJSON(),
              voicefiles: data,
              userFavoritesArr: userFavoritesArr,
              userLikesArr: userLikesArr,
              pagination: getPagination(limit, page, result.count)
            })
          })
          .catch(err => console.log(err))
      })
  }
}
module.exports = frontsideController