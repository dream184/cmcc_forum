const db = require('../models')
const User = db.User
const VoiceFile = db.Voicefile
const AttendClass = db.AttendClass
const Homework = db.Homework
const Authority = db.Authority
const Class = db.Class
const bcrypt = require('bcryptjs')
const googleDrive = require('./google_drive_method')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const avatarImgFolderId = process.env.GOOGLE_USER_AVATAR_IMAGE_FOLDER_ID
const pageLimit = 15

const userController = {
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if(req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不相同')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email }})
        .then(user => {
          if(user) {
            req.flash('error_messages', '您已經註冊過了')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
              AuthorityId: 4
            })
              .then(user => {
                req.flash('success_messages', '成功註冊帳號')
                return res.redirect('/signin')
              })
              .catch(err => console.log(err))
          }
        })
    }
  },
  signin: (req, res) => {
    req.flash('success_messages', '成功登入')
    return res.redirect('/classes')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出')
    req.logout()
    return res.redirect('/classes')
  },
  getUsers: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    User.findAndCountAll({
      offset: offset,
      limit: pageLimit,
      raw: true,
      nest: true,
      include: [Authority]
    })
      .then((result) => {     
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1
        const data = result.rows
        return res.render('admin/users', {
          users: data,
          layout: 'admin',
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
  },
  profilePage: (req, res)  => {
    return User.findByPk(req.user.id, {
      include: [
        { model: AttendClass, include: [Class] }
      ]
    })
      .then((user) => {
        return VoiceFile.findAll({
          where: { UserId: user.id },
          include: [{
            model: Homework,
            include: [Class]
          }],
          raw: true,
          nest: true
        })
          .then((voicefiles) => {
            return res.render('profile', { 
              user: user.toJSON(),
              voicefiles: voicefiles
          })
        })
      })
      
  },
  editProfile: (req, res) => {
    return User.findByPk(req.user.id, {
      include: [
        { model: AttendClass, include: [Class] }
      ]
    })
      .then((user) => {
        return res.render('editProfile', { user: user.toJSON() })
      })
  },
  putUserProfile: (req, res) => {
    const { name, nickname, introduction } = req.body
    const { file } = req

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            googleDrive.deleteFile(user.googleImageId)
            return user.update({
              name: name,
              nickName: nickname,
              introduction: introduction,
              image: file ? img.data.link : null
            })
          })
            .then(() => {
              req.flash('success_messages', '會員資料已更新')
              return res.redirect('back')
            })
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          return user.update({
            name: name,
            nickName: nickname,
            introduction: introduction
          })
        })
          .then(() => {
            req.flash('success_messages', '會員資料已更新')
            return res.redirect('back')
          })
    } 
  },
  putUserEmailPassword: (req, res) => {
    const { email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      req.flash('error_messages', '兩次密碼輸入不同')
      return res.redirect('back')
    }
    if (password.length < 6) {
      req.flash('error_messages', '密碼長度至少6碼')
      return res.redirect('back')
    }
    return User.findByPk(req.params.id)
      .then((user) => {
        return user.update({
          email: email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        })
        .then(() => {
          req.flash('success_messages', '會員資料已更新')
          return res.redirect('back')
        })
      })
  },
  putUserAuthority: (req, res) => {
    const { authority } = req.body
    if(req.user.Authority.name !== 'admin') {
      req.flash('error_messages', '您沒有權限進行此操作')
      return res.redirect('back')
    }
    if(!authority) {
      req.flash('error_messages', '未選擇權限!')
      return res.redirect('back')
    }
    return User.findByPk(req.params.id)
      .then((user) => {
        user.update({AuthorityId: authority})
          .then(() => {
            req.flash('success_messages', '已修改權限!')
            return res.redirect('back')
          })
      })   
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Authority,
        { model: AttendClass, include: [Class] },
      ]
    })
      .then((user) => {
        return Class.findAll({
          raw: true,
          limit: 10,
          order: [['createdAt', 'DESC']]
        })
          .then((selectedClasses) => {
            return res.render('admin/editUser', { 
              user: user.toJSON(),
              class: selectedClasses,
              layout: 'admin'
            })
          })
      })
  }
}

module.exports = userController