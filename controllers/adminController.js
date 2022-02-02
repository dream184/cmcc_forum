const { Class, Homework, } = require('../models')
const googleDrive = require('../helpers/googleDriveHelpers.js')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const rootFolderId = process.env.GOOGLE_ROOT_FOLDER_ID
const pageLimit = 15
const { dayjs } = require('../helpers/dayjsHelpers')

const adminController = {
  getClasses: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    Class.findAndCountAll({
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
        return res.render('admin/classes', {
          classes: data,
          layout: 'admin',
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
  },
  createClass: (req, res) => {
    return res.render('admin/createClass', {layout: 'admin'})
  },
  editClass: (req, res) => {
    return Class.findByPk(req.params.id)
      .then((selectedClass) => {
        return res.render('admin/editClass', {
          class: selectedClass.toJSON(),
          layout: 'admin'
        })
      })
  },
  putClass: (req, res) => {
    const { file } = req
    const { name, isPublic } = req.body

    if (name.trim().length === 0) {
      req.flash('error_messages', '必須填寫名稱')
      return res.redirect('back')
    }
    if (!isPublic) {
      req.flash('error_messages', '必須選擇作業狀態')
      return res.redirect('back')
    }

    if(file) {
      return Class.findByPk(req.params.id).then((selectedClass) => {
        if(name !== selectedClass.name) {
          googleDrive.renameFile(name, selectedClass.googleFolderId)
        }
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, (err, img) => {
          return selectedClass.update({
            name: name,
            isPublic: isPublic,
            image: file ? img.data.link : null
          })
            .then(() => {
              req.flash('success_messages', '班級更新成功')
              return res.redirect('/admin/classes')
            })
            .catch((error) => {
              req.flash('error_messages', '班級更新失敗')
              console.log(error)
              return res.redirect('back')
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
            req.flash('success_messages', '班級更新成功')
            return res.redirect('/admin/classes')
          })
          .catch((error) => {
            req.flash('error_messages', '班級更新失敗')
            console.log(error)
            return res.redirect('back')
          })  
      })
    }
  },
  postClass: (req, res) => {
    const { file } = req
    const { name, isPublic } = req.body

    if (name.trim().length === 0) {
      req.flash('error_messages', '必須填寫名稱')
      return res.redirect('back')
    }
    if (!isPublic) {
      req.flash('error_messages', '必須選擇作業狀態')
      return res.redirect('back')
    }
    
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return googleDrive.createFolder(name, rootFolderId)
          .then((folder) => {
              Class.create({
                name: name,
                isPublic: isPublic,
                image: file ? img.data.link : null,
                googleFolderId: folder.id
              })
                .then(() => {
                  req.flash('success_messages', '班級已經成功建立！')
                  return res.redirect('/admin/classes')
                })
                .catch((error) => {
                  req.flash('error_messages', '班級無法建立！')
                  console.log(error)
                  return res.redirect('back')
                })
          })
      })
    } else {
      return googleDrive.createFolder(name, rootFolderId)
        .then((folder) => {
          return Class.create({
            name: name,
            isPublic: isPublic,
            image: null,
            googleFolderId: folder.id
          })
            .then(() => {
              req.flash('success_messages', '班級已經成功建立！')
              return res.redirect('/admin/classes')
            })
            .catch((error) => console.log(error))
        })
    }
  },
  removeClass: (req, res) => {
    return Class.findByPk(req.params.id)
      .then((selectedClass) => {
        selectedClass.destroy()
          .then(() => {
            googleDrive.deleteFile(selectedClass.googleFolderId)
            googleDrive.deleteFile(selectedClass.image)
          })
          .then(() => {
            req.flash('success_messages', '班級已經成功被刪除！')
            return res.redirect('/admin/classes')
          })
          .catch((error) => {
            req.flash('error_messages', '無法刪除')
            console.log(error)
            return res.redirect('back')
          })  
    })
  },
  getHomeworks: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    return Class.findByPk(req.params.id)
      .then((selectedClass) => {
        return Homework.findAndCountAll({
          offset: offset,
          limit: pageLimit,
          where: { ClassId: req.params.id },
          include: [Class]
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
            console.log(data)
            return res.render('admin/homework', {
              homework: data,
              class: selectedClass.toJSON(),
              layout: 'admin',
              page: page,
              totalPage: totalPage,
              prev: prev,
              next: next
            })
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

    if (name.trim().length === 0) {
      req.flash('error_messages', '必須填寫名稱')
      return res.redirect('back')
    }
    if (expiredTime.trim().length === 0) {
      req.flash('error_messages', '必須選擇截止日期')
      return res.redirect('back')
    }
    if (!isPublic) {
      req.flash('error_messages', '必須選擇作業狀態')
      return res.redirect('back')
    }
    
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Class.findByPk(classId)
          .then((selectedClass) => {
            return googleDrive.createFolder(name, selectedClass.googleFolderId)
              .then((folder) => {
                Homework.create({
                  name: name,
                  isPublic: isPublic,
                  image: file ? img.data.link : null,
                  description: description,
                  googleFolderId: folder.id,
                  expiredTime: dayjs(expiredTime, "Asia/Taipei").format('YYYY/MM/DD HH:mm:ss'),
                  ClassId: classId
                })
                  .then(() => {
                    req.flash('success_messages', '已成功建立作業')
                    return res.redirect(`/admin/classes/${classId}/homeworks`)
                  })
                  .catch((error) => console.log(error))
              })
          })
      })
    } else {
      Class.findByPk(req.params.id).then((selectedClass) => {
        return googleDrive.createFolder(name, selectedClass.googleFolderId)
          .then((folder) => {
            return Homework.create({
              name: name,
              isPublic: isPublic,
              image: null,
              description: description,
              googleFolderId: folder.id,
              expiredTime: dayjs(expiredTime, "Asia/Taipei",).format('YYYY/MM/DD HH:mm:ss'),
              ClassId: req.params.id
            })
              .then(() => {
                req.flash('success_messages', '已成功建立作業')
                return res.redirect(`/admin/classes/${classId}/homeworks`)
              })
              .catch((error) => console.log(error))
          })
      }) 
    }
  },
  editHomework: (req, res) => {
    return Homework.findByPk(req.params.id)
      .then((homework) => {
        const homeworkJSON = homework.toJSON()
        homeworkJSON.expiredTime = dayjs(homeworkJSON.expiredTime).format('YYYY-MM-DD')
        return res.render('admin/editHomework', { homework: homeworkJSON, layout: 'admin' })
      })
  },
  putHomework: (req, res) => {
    const { file } = req
    const { name, description, expiredTime, isPublic } = req.body

    if (name.trim().length === 0) {
      req.flash('error_messages', '必須填寫名稱')
      return res.redirect('back')
    }
    if (expiredTime.trim().length === 0) {
      req.flash('error_messages', '必須選擇截止日期')
      return res.redirect('back')
    }
    if (!isPublic) {
      req.flash('error_messages', '必須選擇作業狀態')
      return res.redirect('back')
    }

    if(file) {
      return Homework.findByPk(req.params.id)
        .then((homework) => {
          if(name !== homework.name) {
            googleDrive.renameFile(name, homework.googleFolderId)
          }

          imgur.setClientID(IMGUR_CLIENT_ID)
          imgur.upload(file.path, (err, img) => { 
            return homework.update({
              name: name,
              isPublic: isPublic,
              image: file ? img.data.link : null,
              description: description,
              expiredTime: dayjs(expiredTime, "Asia/Taipei").format('YYYY/MM/DD HH:mm:ss')
            })
              .then(() => {
                req.flash('success_messages', '作業更新成功')
                return res.redirect(`/admin/classes/${homework.ClassId}/homeworks`)
              })
              .catch((error) => {
                console.log(error)
                req.flash('error_messages', '更新失敗')
                return res.redirect('back')
              })  
          })
        })
    } else {
      return Homework.findByPk(req.params.id)
        .then((homework) => {
          if(name !== homework.name) {
            googleDrive.renameFile(name, homework.googleFolderId)
          }
          return homework.update({
            name: name,
            isPublic: isPublic,
            description: description,
            expiredTime: dayjs(expiredTime, "Asia/Taipei").format('YYYY/MM/DD HH:mm:ss')
          })
            .then(() => {
              req.flash('success_messages', '作業更新成功')
              return res.redirect(`/admin/classes/${homework.ClassId}/homeworks`)
            })
            .catch((error) => {
              console.log(error)
              req.flash('error_messages', '更新失敗')
              return res.redirect('back')
            }) 
        })
    }
  },
  deleteHomework: (req, res) => {
    return Homework.findByPk(req.params.id)
      .then((homework) => {
        homework.destroy()
          .then(() => {
            googleDrive.deleteFile(homework.googleFolderId)
            googleDrive.deleteFile(homework.image)
          })
          .then(() => {
            req.flash('success_messages', '作業已經成功被刪除')
            return res.redirect(`/admin/classes/${homework.ClassId}/homeworks`)
          })
          .catch((error) => {
            req.flash('error_messages', '無法刪除')
            console.log(error)
            return res.redirect('back')
          })
    })
  }

}
module.exports = adminController