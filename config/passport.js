const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Authority = db.Authority
const Favorite = db.Favorite
const Like = db.Like

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, username, password, done) => {
    User.findOne({ where: { email: username }})
      .then(user => {
        if(!user) return done(null, false, req.flash('error_messages', '帳號輸入錯誤！'))
        if(!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_messages', '密碼輸入錯誤！'))
        return done(null, user)
      })
      .catch(error => console.log(error))
  }
))

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_CLIENTSECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
  (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ where: { email: email } })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user)) 
          .catch(err => done(err, false))
      })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [Authority, Favorite, Like]
  })
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
})

module.exports = passport