const { AttendClass, User } = require('../models')

const attendController = {
  deleteAttendClass: (req, res) => {
    if(req.user.Authority.name !== 'admin') {
      req.flash('error_messages', '您沒有權限進行此操作')
      return res.redirect('back')
    }
    return AttendClass.findByPk(req.params.id)
      .then((attendClass) => {
        attendClass.destroy()
        req.flash('success_messages', '已成功退出班級')
        return res.redirect('back')
      })
  },
  addAttendClass: (req, res) => {
    if(req.user.Authority.name !== 'admin') {
      req.flash('error_messages', '您沒有權限進行此操作')
      return res.redirect('back')
    }
    if(req.body.ClassId === undefined) {
      req.flash('error_messages', '必須選擇班級')
      return res.redirect('back')
    }

    return User.findByPk(req.params.id, {
      include: [AttendClass]
    })
      .then((user) => {
        const attendClassArr = user.AttendClasses
        const classIdArr = attendClassArr.map(e => e.ClassId)

        if (classIdArr.includes(Number(req.body.ClassId))) {
          req.flash('error_messages', '班級重覆，無法加入該班級')
          return res.redirect('back')
        }

        return AttendClass.create({
          UserId: req.params.id,
          ClassId: req.body.ClassId
        })
          .then(() => {
            req.flash('success_messages', '已加入班級')
            return res.redirect('back')
          })
      })
  }
}

module.exports = attendController