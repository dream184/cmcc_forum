const db = require('../models')
const googleDrive = require('./google_drive_method.js')
const Class = db.Class
const rootFolderId = process.env.GOOGLE_ROOT_FOLDER_ID
const classImgFolderId = process.env.GOOGLE_CLASS_IMAGE_FOLDER_ID

const adminController = {
  getClasses: (req, res) => {
    Class.findAll({ raw: true })
      .then((classes) => {
        return res.render('admin/classes', { classes: classes})
      })
  },
  createClass: (req, res) => {
    return res.render('admin/createClass')
  },
  postClass: (req, res) => {
    const { file } = req
    const { name, isPublic } = req.body
    console.log(file, name, isPublic)

    if (file) {
      googleDrive.uploadImage(file, name, classImgFolderId).then((uploadedId) => {
        return googleDrive.becomePublic(uploadedId).then((publicImage) => {
          return googleDrive.createFolder(name, rootFolderId).then((folderId) => {
            Class.create({
              name: name,
              isPublic: isPublic,
              image: publicImage.id,
            })
              .then(() => {
                return res.redirect('/admin/classes')
              })
              .catch((error) => console.log(error))
          })
        })
      })
    } else {
      return googleDrive.createFolder(name, rootFolderId).then((folderId) => {
        return Class.create({
          name: name,
          isPublic: isPublic,
          image: '',
        })
          .then(() => {
            return res.redirect('/admin/classes')
          })
          .catch((error) => console.log(error))
      })
    }
  }
}

module.exports = adminController