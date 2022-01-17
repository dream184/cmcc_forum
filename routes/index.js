const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const auth = require('./modules/auth')
const voiceClass = require('./modules/class')
const favorite = require('./modules/favorite')
const like = require('./modules/like')
const user = require('./modules/user')
const home = require('./modules/home')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/user/signin')
}

router.use('/admin', authenticated, admin)
router.use('/auth', auth)
router.use('/classes', authenticated, voiceClass)
router.use('/favorites', authenticated, favorite)
router.use('/like', authenticated, like)
router.use('/user', user)
router.use('/', authenticated, home)

module.exports = router
