const adminController = require('../controllers/adminController.js')
const frontsideController = require('../controllers/frontsideController')
const voiceFileController = require('../controllers/voiceFileController')
const multer = require('multer')
const userController = require('../controllers/userController.js')
const attendController = require('../controllers/attendController.js')
const feedbackController = require('../controllers/feedbackController')
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
  app.get('/admin/classes/create', authenticated, adminController.createClass)
  app.get('/admin/classes/:id/edit', authenticated, adminController.editClass)
  app.put('/admin/classes/:id', authenticated, upload.single('imageFile'), adminController.putClass)
  app.post('/admin/classes', authenticated, upload.single('imageFile'), adminController.postClass) 
  app.delete('/admin/classes/:id', authenticated, adminController.removeClass)

  app.get('/admin/classes/:id/homeworks', authenticated, adminController.getHomeworks)
  app.get('/admin/classes/:id/homeworks/create', authenticated, adminController.createHomework)
  app.post('/admin/classes/:id/homeworks', authenticated, upload.single('imageFile'), adminController.postHomework)
  app.get('/admin/classes/:id/homeworks/:id/edit', authenticated, adminController.editHomework)
  app.put('/admin/classes/:id/homeworks/:id', authenticated, upload.single('imageFile'), adminController.putHomework)
  app.delete('/admin/classes/:id/homeworks/:id', authenticated, adminController.deleteHomework )
  app.get('/admin/users', authenticated, userController.getUsers)
  app.put('/admin/users/:id/authority', authenticated, userController.putUserAuthority)
  app.get('/admin/users/:id/edit', authenticated, userController.editUser)
  app.post('/admin/users/:id/attendclasses', authenticated, attendController.addAttendClass)
  app.delete('/admin/users/:id/attendclasses/:id', authenticated, attendController.deleteAttendClass)
  app.get('/admin/voicefiles', authenticated, voiceFileController.getVoiceFiles)
  app.post('/admin/voicefiles/:id/feedbacks', authenticated, feedbackController.postAdminFeedback)
  app.get('/admin/voicefiles/waitingfeedback', authenticated, voiceFileController.getNoFeedbackVoicefiles)
  app.get('/admin/voicefiles/:id/feedbacks', authenticated, feedbackController.getAdminFeedbacks)
  app.get('/admin/voicefiles/:id/feedbacks/:id/edit', feedbackController.editAdminFeedback)
  app.put('/admin/voicefiles/:id/feedbacks/:id', feedbackController.putAdminFeedback)
  app.get('/admin/voicefiles/:orderby', authenticated, voiceFileController.getVoiceFilesByOrder)

  app.get('/classes', authenticated, frontsideController.getClasses)
  app.get('/classes/:id', authenticated, frontsideController.getHomeworks)
  app.get('/classes/:id/homeworks/:id', authenticated, frontsideController.getHomework)
  app.post('/classes/:id/homeworks/:id/uploadVoiceFile', authenticated, upload.single('voiceFile'), voiceFileController.postVoiceFile)
  app.delete('/classes/:id/homeworks/:id/voicefiles/:id', authenticated, voiceFileController.deleteVoiceFile)
  app.get('/classes/:id/homeworks/:id/voicefiles/:id/feedbacks', authenticated, feedbackController.getFeedbacks)
  app.post('/classes/:id/homeworks/:id/voicefiles/:id/feedbacks', feedbackController.postFeedback)
  app.get('/classes/:id/homeworks/:id/voicefiles/:id/feedbacks/:id/edit', authenticated, feedbackController.editFeedback)
  app.put('/classes/:id/homeworks/:id/voicefiles/:id/feedbacks/:id', authenticated, feedbackController.putFeedback)
  app.delete('/classes/:id/homeworks/:id/voicefiles/:id/feedbacks/:id', authenticated, feedbackController.deleteFeedback)

  app.get('/signin', userController.signInPage)
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
  app.get('/logout', authenticated, userController.logout)

  app.get('/profile', authenticated, userController.profilePage)
  app.get('/profile/edit', authenticated, userController.editProfile)
  app.put('/profile/:id', authenticated, upload.single('avatar'), userController.putUserProfile)
  app.put('/profile/:id/emailpassword', authenticated, userController.putUserEmailPassword)
}

