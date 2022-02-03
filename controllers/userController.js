const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { User, Voicefile, AttendClass, Homework, Authority, Class } = require('../models')
const { getOffset, getPagination } = require('../helpers/paginationHelper')
const { imgurFileHandler } = require('../helpers/imgurFileHelper')
const nodemailer = require('../helpers/nodemailerHelper.js')
const { subject, mailContent } = require('../helpers/resetmailHelper')
const { client, redisConnect } = require('../helpers/redisHelper')

redisConnect()

const userController = {
  resetPasswordPage: (req, res) => {
    const { email, token } = req.query
    client.get(`RESET_PASSWORD:${email}`)
      .then((dataJSON) => {
        const dataObject = JSON.parse(dataJSON)
        if (!dataJSON) {
          req.flash('error_messages', '重置密碼無效或逾期')
          console.log('重置密碼無效或逾期')
          return res.redirect('/user/signin')
        }
        if (dataObject.token !== token) {
          req.flash('error_messages', '該Token無效，請重新申請')
          console.log('該Token無效')
          return res.redirect('/user/signin')
        }
        req.flash('success_messages', '您現在可以重置密碼')
        return User.findOne({ where: { email: email } })
          .then((user) => {
            return res.render('resetPassword', {
              user: user.toJSON(),
              token: token
            })
          })
      })
  },
  resetPassword: (req, res) => {
    const { email, token, password, passwordCheck } = req.body

    client.get(`RESET_PASSWORD:${email}`)
      .then((dataJSON) => {
        const dataObject = JSON.parse(dataJSON)
        if (!dataJSON) {
          req.flash('error_messages', '重置密碼無效或逾期')
          console.log('重置密碼無效或逾期')
          return res.redirect('/user/signin')
        }
        if (dataObject.token !== token) {
          req.flash('error_messages', '該Token無效，請重新申請')
          console.log('該Token無效')
          return res.redirect('/user/signin')
        }
        if (password !== passwordCheck) {
          req.flash('error_messages', '兩次密碼輸入不同，請重新確認')
          return res.redirect('back')
        }
        if (password.trim().length === 0) {
          req.flash('error_messages', '密碼不得為空')
          return res.redirect('back')
        }
        if (password.length < 6) {
          req.flash('error_messages', '密碼長度至少6碼')
          return res.redirect('back')
        }

        return User.findOne({ where: { email: email } })
          .then((user) => {
            return user.update({
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(() => {
                req.flash('success_messages', '已成功更新密碼')
                return res.redirect('/user/signin')
              })
          })
      })
  },
  forgotPasswordPage: (req, res) => {
    return res.render('forgotPassword')
  },
  submitForgetPassword: (req, res) => {
    const { email } = req.body;
    return User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          req.flash('error_messages', '該用戶不存在')
          return res.redirect('back')
        }
        const expireTime = 300
        const token = crypto.randomBytes(32).toString('hex')
        const item = JSON.stringify({ email, token })
        
        return client.set(`RESET_PASSWORD:${email}`, item, {
          EX: expireTime,
          NX: false
        })
          .then((result) => {
            return client.get(`RESET_PASSWORD:${item.email}`)
              .then((value) => {
                console.log('redis_value', value)
                return nodemailer.send(email, subject, mailContent(user.email, token))
                  .then(() => {
                    req.flash('success_messages', '已成功寄出密碼重置信件到您的信箱')
                    return res.redirect('/user/signin')
                  })
              })  
          })
      })  
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if(req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不相同')
      return res.redirect('/user/signup')
    } 
    if (req.body.password.length < 6) {
      req.flash('error_messages', '密碼長度至少6碼')
      return res.redirect('back')
    }
    if (req.body.password.trim().length === 0) {
      req.flash('error_messages', '密碼不得為空')
      return res.redirect('back')
    }

    return User.findOne({ where: { email: req.body.email }})
      .then(user => {
        if(user) {
          req.flash('error_messages', '您已經註冊過了')
          return res.redirect('/user/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          })
            .then(user => {
              req.flash('success_messages', '成功註冊帳號')
              return res.redirect('/user/signin')
            })
            .catch(err => console.log(err))
        }
      })
  },
  signin: (req, res) => {
    req.flash('success_messages', '成功登入')
    return res.redirect('/classes')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出')
    req.logout()
    return res.redirect('/user/signin')
  },
  getUsers: (req, res) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return User.findAndCountAll({
      offset,
      limit,
      raw: true,
      nest: true,
      include: [Authority]
    })
      .then((result) => {     
        const data = result.rows
        return res.render('admin/users', {
          users: data,
          layout: 'admin',
          pagination: getPagination(limit, page, result.count)
        })
      })
  },
  profilePage: (req, res) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return User.findByPk(req.user.id, {
      include: [
        { model: AttendClass, include: [Class] }
      ]
    })
      .then((user) => {
        return Voicefile.findAndCountAll({
          offset,
          limit,
          where: { UserId: user.id },
          include: [{
            model: Homework,
            include: [Class]
          }],
        })
          .then((result) => {
            const data = result.rows.map(r => ({
              ...r.dataValues
            }))
            return res.render('profile', { 
              user: user.toJSON(),
              voicefiles: data,
              pagination: getPagination(limit, page, result.count)
            })   
          })  
      })
      .catch(err => console.log(err))
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
    return imgurFileHandler(file)
      .then((filePath) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            return user.update({
              name: name,
              nickName: nickname,
              introduction: introduction,
              image: filePath || user.image
            })
          })
          .then(() => {
            req.flash('success_messages', '會員資料已更新')
            return res.redirect('back')
          })
          .catch(err => console.log(err))
      })
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
    if (password.trim().length === 0) {
      req.flash('error_messages', '密碼不得為空')
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
        return user.update({AuthorityId: authority})
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
              userData: user.toJSON(),
              class: selectedClasses,
              layout: 'admin'
            })
          })
      })
  }
}

module.exports = userController