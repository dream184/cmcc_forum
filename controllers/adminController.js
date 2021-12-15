const db = require('../models')
const Class = db.Class


const adminController = {
  getClasses: (req, res) => {
    // Class.findAll()
    //   .then((classes) => {
    //     return res.render('index', { classes: classes.toJSON() })
    //   })
    return res.render('admin/classes')
  },
}

module.exports = adminController