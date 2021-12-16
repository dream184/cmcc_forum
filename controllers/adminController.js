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
  },
  postClass: (req, res) => {
    console.log(req.body)
    const { file } = req
    console.log(file)
    // return Class.create({
    //   name: req.body.className,
    //   isPublic: req.body.isPublic,
    //   image: file,
    // }).
    // then(() => {
    //   return res.redirect('/admin/classes')
    // })
  }
}

module.exports = adminController