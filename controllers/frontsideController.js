const { Class, Homework, Voicefile, User } = require('../models')
const pageLimit = 10

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
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    return Homework.findOne({
      where: {id: req.params.id},
      include: [Class]
    })
      .then((homework) => {
        Voicefile.findAndCountAll({   
          where: { HomeworkId: homework.id },
          include: [User],
          offset: offset,
          limit: pageLimit,
          order: [['createdAt', 'DESC']]
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
            const user = req.user
            const userFavoritesArr = user.Favorites.map(e => e.VoicefileId)
            const userLikesArr = user.Likes.map(e => e.VoicefileId)
            return res.render('homework', { 
              homework: homework.toJSON(),
              voicefiles: data,
              userFavoritesArr: userFavoritesArr,
              userLikesArr: userLikesArr,
              page: page,
              totalPage: totalPage,
              prev: prev,
              next: next
            })
          })
          .catch(err => console.log(err))
      })
  }
}
module.exports = frontsideController