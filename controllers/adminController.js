const { Class, Homework, } = require('../models')
const googleDrive = require('../helpers/googleDriveHelpers.js')
const { dayjs } = require('../helpers/dayjsHelpers')
const { getOffset, getPagination } = require('../helpers/paginationHelper')
const { imgurFileHandler } = require('../helpers/imgurFileHelper')
const rootFolderId = process.env.GOOGLE_ROOT_FOLDER_ID

const adminController = {
  getClasses: (req, res) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Class.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset,
      limit
    })
      .then((result) => {
        const data = result.rows.map(r => ({
          ...r.dataValues
        }))
        return res.render('admin/classes', {
          classes: data,
          layout: 'admin',
          pagination: getPagination(limit, page, result.count)
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
    return Class.findByPk(req.params.id)
      .then((selectedClass) => {
        if(name !== selectedClass.name) {
          googleDrive.renameFile(name, selectedClass.googleFolderId)
        }
        return imgurFileHandler(file)
          .then(filePath => {
            return selectedClass.update({
              name: name,
              isPublic: isPublic,
              image: filePath || selectedClass.image
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
    return Promise.all([
      imgurFileHandler(file),
      googleDrive.createFolder(name, rootFolderId)
    ])
      .then(([filePath, folder]) => {
        return Class.create({
          name: name,
          isPublic: isPublic,
          image: filePath,
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
  },
  removeClass: (req, res) => {
    return Class.findByPk(req.params.id)
      .then((selectedClass) => {
        return selectedClass.destroy()
          .then(() => {
            return googleDrive.deleteFile(selectedClass.googleFolderId)
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
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    let offset = getOffset(limit, page)
    return Class.findByPk(req.params.id)
      .then((selectedClass) => {
        return Homework.findAndCountAll({
          offset,
          limit,
          where: { ClassId: req.params.id },
          include: [Class]
        })
          .then((result) => {
            const data = result.rows.map(r => ({
              ...r.dataValues
            }))
            return res.render('admin/homework', {
              homework: data,
              class: selectedClass.toJSON(),
              layout: 'admin',
              pagination: getPagination(limit, page, result.count)
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
    return Promise.all([
      imgurFileHandler(file),
      Class.findByPk(classId)
    ])
      .then(([filePath, selectedClass]) => {
        return googleDrive.createFolder(name, selectedClass.googleFolderId)
          .then((folder) => {
            Homework.create({
              name: name,
              isPublic: isPublic,
              image: filePath,
              description: description,
              googleFolderId: folder.id,
              expiredTime: dayjs(expiredTime, "Asia/Taipei").format('YYYY/MM/DD HH:mm:ss'),
              ClassId: classId
            })
              .then(() => {
                req.flash('success_messages', '已成功建立作業')
                return res.redirect(`/admin/classes/${classId}/homeworks`)
              })
              .catch((error) => {
                console.log(error)
                req.flash('error_messages', '無法建立作業')
                return res.redirect('back')
              })
          })
      })
  },
  editHomework: (req, res) => {
    return Homework.findByPk(req.params.id, {
      raw: true
    })
      .then((homework) => {
        return res.render('admin/editHomework', {
          homework,
          layout: 'admin'
        })
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

    return Homework.findByPk(req.params.id)
      .then((homework) => {
        if(name !== homework.name) {
          googleDrive.renameFile(name, homework.googleFolderId)
        }
        return imgurFileHandler(file)
          .then((filePath) => {
            return homework.update({
              name: name,
              isPublic: isPublic,
              image: filePath || homework.image,
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
  },
  deleteHomework: (req, res) => {
    return Homework.findByPk(req.params.id)
      .then((homework) => {
        return homework.destroy()
      })
      .then(() => {
        return googleDrive.deleteFile(homework.googleFolderId)
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
  }
}
module.exports = adminController