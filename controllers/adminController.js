const db = require('../models')
const Class = db.Class


const adminController = {
  getClasses: (req, res) => {
    Class.findAll({ raw: true })
      .then((classes) => {
        console.log(classes)
        return res.render('admin/classes', { classes: classes})
      })
  },
  createClass: (req, res) => {
    return res.render('admin/createClass')
  }
}

module.exports = adminController