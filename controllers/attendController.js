const { AttendClass, User, Class } = require('../models')

const attendController = {
  addAttendClass: (req, res) => {
    if(req.body.ClassId === undefined) {
      req.flash('error_messages', '必須選擇班級')
      return res.redirect('back')
    }

    return User.findByPk(req.params.id, {
      include: [{
        model: Class, as: 'AttendedClasses' 
      }]
    })
      .then((user) => {
        const attendClassArr = user.AttendedClasses
        const attendClassIdArr = attendClassArr.map(e => e.id)

        if (attendClassIdArr.includes(Number(req.body.ClassId))) {
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
          .catch((err) => {
            req.flash('error_messages', '無法加入班級')
            console.log(err)
            return res.redirect('back')
          })
      })
  },
  deleteAttendClass: (req, res) => {
    return AttendClass.findByPk(req.params.id)
      .then((attendClass) => {
        attendClass.destroy()
      })
      .then(() => {
        req.flash('success_messages', '已成功退出班級')
        return res.redirect('back')
      })
      .catch((err) => {
        req.flash('error_messages', '無法刪除班級')
        console.log(err)
        return res.redirect('back')
      })
  }
}

module.exports = attendController