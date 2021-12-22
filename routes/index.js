const adminController = require('../controllers/adminController.js')
const frontsideController = require('../controllers/frontsideController')
const voiceFileController = require('../controllers/voiceFileController')
const multer = require('multer')
const userController = require('../controllers/userController.js')
const upload = multer({ dest: 'temp/'})

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  app.get('/', (req, res) => {res.redirect('/classes')})
  app.get('/admin/classes', authenticated, adminController.getClasses)
  app.get('/admin/classes/create', adminController.createClass)
  app.get('/admin/classes/:id/edit', adminController.editClass)
  app.put('/admin/classes/:id', upload.single('imageFile'), adminController.putClass)
  app.post('/admin/classes', upload.single('imageFile'), adminController.postClass) 
  app.delete('/admin/classes/:id', adminController.removeClass)

  app.get('/admin/classes/:id/homeworks',adminController.getHomeworks)
  app.get('/admin/classes/:id/homeworks/create', adminController.createHomework)
  app.post('/admin/classes/:id/homeworks', upload.single('imageFile'), adminController.postHomework)
  app.get('/admin/classes/:id/homeworks/:id/edit', adminController.editHomework)
  app.put('/admin/classes/:id/homeworks/:id', upload.single('imageFile'), adminController.putHomework)
  app.delete('/admin/classes/:id/homeworks/:id', adminController.deleteHomework )

  app.get('/classes', frontsideController.getClasses)
  app.get('/classes/:id', frontsideController.getHomeworks)
  app.get('/classes/:id/homeworks/:id', frontsideController.getHomework)

  app.post('/classes/:id/homeworks/:id/uploadVoiceFile', upload.single('voiceFile'), voiceFileController.postVoiceFile)
  app.delete('/classes/:id/homeworks/:id/voicefiles/:id', voiceFileController.deleteVoiceFile)

  app.get('/signin', userController.signInPage)
  app.get('/signup', userController.signUpPage)

  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
  app.get('/logout', userController.logout)
}


