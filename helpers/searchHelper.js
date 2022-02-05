const { Homework, Class, User } = require('../models')
const Op = require('sequelize').Op

async function search(type, keyword) {
  try {
    if (type === 'author') {
      const users = await User.findAll({
        attributes: ['id'],
        where: { name: { [Op.substring]: keyword } },
        raw: true
      })
      const usersIdArr = users.map(e => e.id)
      return { UserId: usersIdArr }
    }
    if (type === 'homework') {
      const homeworks = await Homework.findAll({
        attributes: ['id'],
        where: { name: { [Op.substring]: keyword } },
        raw: true
      })
      const homewroksIdArr = homeworks.map(e => e.id)
      return { HomeworkId: homewroksIdArr }
    }
    if (type === 'class') {
      const classes = await Class.findAll({
        attributes: ['id'],
        where: { name: { [Op.substring]: keyword } },
        raw: true
      })
      const classesArr = classes.map(e => e.id)
      return { ClassId: classesArr }
    }
    return null
  } catch (err) {
    console.log(err)
  }
}

module.exports = { search }