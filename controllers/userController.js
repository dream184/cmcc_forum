const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

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
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                req.flash('success_messages', '成功註冊帳號')
                return res.redirect('/signin')
              })
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
  }

}

module.exports = userController