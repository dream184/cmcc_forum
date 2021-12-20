const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
dayjs.locale('zh-tw') 
dayjs.extend(utc)
dayjs.extend(timezone)

const db = require('../models')
const googleDrive = require('./google_drive_method.js')
const Class = db.Class
const Homework = db.Homework
const rootFolderId = process.env.GOOGLE_ROOT_FOLDER_ID
const classImgFolderId = process.env.GOOGLE_CLASS_IMAGE_FOLDER_ID
const homeworkImgFolderId = process.env.GOOGLE_HOMEWORK_IMAGE_FOLDER_ID

const adminController = {
  getClasses: (req, res) => {
    Class.findAll({ raw: true })
      .then((classes) => {
        return res.render('admin/classes', { classes: classes, layout: 'admin'})
      })
  },
  createClass: (req, res) => {
    return res.render('admin/createClass', {layout: 'admin'})
  },
  editClass: (req, res) => {
    return Class.findByPk(req.params.id).then((selectedClass) => {
      return res.render('admin/editClass', { class: selectedClass.toJSON(), layout: 'admin' })
    })
  },
  putClass: (req, res) => {
    const { file } = req
    const { name, isPublic } = req.body

    if(file) {
      return Class.findByPk(req.params.id).then((selectedClass) => {
        if(name !== selectedClass.name) {
          googleDrive.renameFile(name, selectedClass.googleFolderId)
        }
        googleDrive.deleteFile(selectedClass.image)
        googleDrive.uploadImage(file, name, classImgFolderId).then((uploadedId) => {
          googleDrive.becomePublic(uploadedId).then((publicImage) => {
            return selectedClass.update({
              name: name,
              isPublic: isPublic,
              image: publicImage.id
            })
              .then(() => {
                return res.redirect('/admin/classes')
              })
              .catch((error) => console.log(error))  
          })
        })
      })
    } else {
      return Class.findByPk(req.params.id).then((selectedClass) => {
        if(name !== selectedClass.name) {
          googleDrive.renameFile(name, selectedClass.googleFolderId)
        }
        return selectedClass.update({
          name: name,
          isPublic: isPublic,
        })
          .then(() => {
            return res.redirect('/admin/classes')
          })
          .catch((error) => console.log(error))  
      })
    }
  },
  postClass: (req, res) => {
    const { file } = req
    const { name, isPublic } = req.body

    if (file) {
      googleDrive.uploadImage(file, name, classImgFolderId).then((uploadedId) => {
        return googleDrive.becomePublic(uploadedId).then((publicImage) => {
          return googleDrive.createFolder(name, rootFolderId).then((folder) => {
            Class.create({
              name: name,
              isPublic: isPublic,
              image: publicImage.id,
              googleFolderId: folder.id
            })
              .then(() => {
                return res.redirect('/admin/classes')
              })
              .catch((error) => console.log(error))
          })
        })
      })
    } else {
      return googleDrive.createFolder(name, rootFolderId).then((folder) => {
        return Class.create({
          name: name,
          isPublic: isPublic,
          image: '',
          googleFolderId: folder.id
        })
          .then(() => {
            return res.redirect('/admin/classes')
          })
          .catch((error) => console.log(error))
      })
    }
  },
  removeClass: (req, res) => {
    return Class.findByPk(req.params.id).then((selectedClass) => {
      selectedClass.destroy().then(() => {
        googleDrive.deleteFile(selectedClass.googleFolderId)
        googleDrive.deleteFile(selectedClass.image)
      })
        .then(() => {
          return res.redirect('/admin/classes')
        })   
    })
  },
  getHomeworks: (req, res) => {
    return Class.findOne({
      where: { id: req.params.id },
      include: [Homework]
    })
      .then((selectedClass) => {
        const selectedClassJSON = selectedClass.toJSON()
        selectedClassJSON.Homework.forEach(x => x.expiredTime = dayjs(x.expiredTime).format('YYYY/MM/DD HH:mm'))
        return res.render('admin/homework', {
          class: selectedClassJSON,
          layout: 'admin'
        })
      })
  },
  createHomework: (req, res) => {
    return Class.findOne({
      where: { id: req.params.id },
      include: [Homework]
    })
      .then((selectedClass) => {
        return res.render('admin/createHomework', { 
          class: selectedClass.toJSON(), 
          layout: 'admin' 
        })
      })
  },
  postHomework: (req, res) => {
    const { file } = req
    const { name, description, expiredTime, isPublic } = req.body
    const classId = req.params.id

    if (file) {
      googleDrive.uploadImage(file, name, homeworkImgFolderId).then((uploadedId) => {
        return googleDrive.becomePublic(uploadedId).then((publicImage) => {
          return Class.findByPk(classId).then((selectedClass) => {
            return googleDrive.createFolder(name, selectedClass.googleFolderId).then((folder) => {
              Homework.create({
                name: name,
                isPublic: isPublic,
                image: publicImage.id,
                description: description,
                googleFolderId: folder.id,
                expiredTime: dayjs(expiredTime, "Asia/Taipei",).format('YYYY/MM/DD HH:mm:ss'),
                ClassId: classId
              })
                .then(() => {
                  return res.redirect(`/admin/classes/${classId}/homeworks`)
                })
                .catch((error) => console.log(error))
            })
          })
        })
      })
    } else {
      Class.findByPk(req.params.id).then((selectedClass) => {
        return googleDrive.createFolder(name, selectedClass.googleFolderId).then((folder) => {
          return Homework.create({
            name: name,
            isPublic: isPublic,
            image: '',
            description: description,
            googleFolderId: folder.id,
            expiredTime: dayjs(expiredTime, "Asia/Taipei",).format('YYYY/MM/DD HH:mm:ss'),
            ClassId: req.params.id
          })
            .then(() => {
              return res.redirect(`/admin/classes/${classId}/homeworks`)
            })
            .catch((error) => console.log(error))
        })
      })
      
    }
  },
  editHomework: (req, res) => {
    return Homework.findByPk(req.params.id).then((homework) => {
      return res.render('admin/editHomework', { homework: homework.toJSON(), layout: 'admin' })
    })
  },
  putHomework: (req, res) => {
    const { file } = req
    const { name, description, expiredTime, isPublic } = req.body

    if(file) {
      return Homework.findByPk(req.params.id).then((homework) => {
        if(name !== homework.name) {
          googleDrive.renameFile(name, homework.googleFolderId)
        }
        googleDrive.deleteFile(homework.image)
        googleDrive.uploadImage(file, name, homeworkImgFolderId).then((uploadedId) => {
          googleDrive.becomePublic(uploadedId).then((publicImage) => {
            return homework.update({
              name: name,
              isPublic: isPublic,
              image: publicImage.id,
              description: description,
              expiredTime: dayjs(expiredTime, "Asia/Taipei",).format('YYYY/MM/DD HH:mm:ss')
            })
              .then(() => {
                return res.redirect(`/admin/classes/${homework.ClassId}/homeworks`)
              })
              .catch((error) => console.log(error))  
          })
        })
      })
    } else {
      return Homework.findByPk(req.params.id).then((homework) => {
        if(name !== homework.name) {
          googleDrive.renameFile(name, homework.googleFolderId)
        }
        return homework.update({
          name: name,
          isPublic: isPublic,
          description: description,
          expiredTime: dayjs(expiredTime, "Asia/Taipei",).format('YYYY/MM/DD HH:mm:ss')
        })
          .then(() => {
            return res.redirect(`/admin/classes/${homework.ClassId}/homeworks`)
          })
          .catch((error) => console.log(error))  
      })
    }

  },
  deleteHomework: (req, res) => {
    return Homework.findByPk(req.params.id).then((homework) => {
      homework.destroy().then(() => {
        googleDrive.deleteFile(homework.googleFolderId)
        googleDrive.deleteFile(homework.image)
      })
        .then(() => {
          return res.redirect(`/admin/classes/${homework.ClassId}/homeworks`)
        })   
    })
  }
}
module.exports = adminController