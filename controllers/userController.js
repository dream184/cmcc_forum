const db = require('../models')
const User = db.User

const userController = {
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signUpPage: (req, res) => {
    return res.render('signup')
  }

}

module.exports = userController