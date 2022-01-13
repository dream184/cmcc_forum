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
const pageLimit = 10
const nodemailer = require('../config/email.js')
const redis = require('redis')
const crypto = require('crypto')
const expireTime = 300

const client = (process.env.NODE_ENV !== 'production') ? redis.createClient() : redis.createClient({url: process.env.REDIS_URL})

async function redisConnect () {
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
}
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
          return res.redirect('/signin')
        }
        if (dataObject.token !== token) {
          req.flash('error_messages', '該Token無效，請重新申請')
          console.log('該Token無效')
          return res.redirect('/signin')
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
    console.log('email:', req.body)

    client.get(`RESET_PASSWORD:${email}`)
      .then((dataJSON) => {
        const dataObject = JSON.parse(dataJSON)
        if (!dataJSON) {
          req.flash('error_messages', '重置密碼無效或逾期')
          console.log('重置密碼無效或逾期')
          return res.redirect('/signin')
        }
        if (dataObject.token !== token) {
          req.flash('error_messages', '該Token無效，請重新申請')
          console.log('該Token無效')
          return res.redirect('/signin')
        }
        if (password !== passwordCheck) {
          req.flash('error_messages', '兩次密碼輸入不同，請重新確認')
          return res.redirect('back')
        }
        if (password.trim().length === 0) {
          req.flash('error_messages', '密碼不得為空')
          return res.redirect('back')
        }
        return User.findOne({ where: { email: email } })
          .then((user) => {
            return user.update({
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(() => {
                req.flash('success_messages', '已成功更新密碼')
                return res.redirect('/signin')
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

        const token = crypto.randomBytes(32).toString('hex')
        const item = JSON.stringify({ email, token })
        const subject = 'cmcc-forum 重設密碼'
        const mailContent = `
          <h1>cmcc-forum 密碼重設信</h1>
          <p>請使用此驗證信重設您的帳戶: ${user.email}</p>
          <p><a href="https://cmcc-forum.herokuapp.com/resetPassword?email=${email}&token=${token}">按此重設密碼</a></p>
          <p>請注意，如果超過五分鐘，則必須重新申請重設密碼</p>
          
        `
        return client.set(`RESET_PASSWORD:${email}`, item, {
          EX: expireTime,
          NX: false
        })
          .then((result) => {
            return client.get(`RESET_PASSWORD:${item.email}`)
              .then((value) => {
                console.log('redis_value', value)
                return nodemailer.send(email, subject, mailContent)
                  .then(() => {
                    req.flash('success_messages', '已成功寄出密碼重置信件到您的信箱')
                    return res.redirect('/signin')
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
  profilePage: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    return User.findByPk(req.user.id, {
      include: [
        { model: AttendClass, include: [Class] }
      ]
    })
      .then((user) => {
        return VoiceFile.findAndCountAll({
          offset: offset,
          limit: pageLimit,
          where: { UserId: user.id },
          include: [{
            model: Homework,
            include: [Class]
          }],
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

            return res.render('profile', { 
              user: user.toJSON(),
              voicefiles: data,
              page: page,
              totalPage: totalPage,
              prev: prev,
              next: next
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