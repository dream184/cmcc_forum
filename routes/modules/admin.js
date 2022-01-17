const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../../controllers/adminController.js')
const attendController = require('../../controllers/attendController.js')
const voiceFileController = require('../../controllers/voiceFileController')
const userController = require('../../controllers/userController.js')
const feedbackController = require('../../controllers/feedbackController.js')

const authenticatedMentorAndAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    const mentorId = 3
    const adminId = 4
    if (req.user.AuthorityId === mentorId || req.user.AuthorityId === adminId) {
      return next()
    }
    req.flash('error_messages', '您沒有權限進行此操作!')
    res.redirect('/admin/voicefiles')
  }
  res.redirect('/user/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    const adminId = 4
    if (req.user.AuthorityId === adminId) {
      return next()
    }
    req.flash('error_messages', '您沒有權限進行此操作!')
    res.redirect('/admin/voicefiles')
  }
  res.redirect('/user/signin')
}

router.get('/classes', authenticatedAdmin, adminController.getClasses)
router.get('/classes/create', authenticatedAdmin, adminController.createClass)
router.get('/classes/:id/edit', authenticatedAdmin, adminController.editClass)
router.put('/classes/:id', authenticatedAdmin, upload.single('imageFile'), adminController.putClass)
router.post('/classes', authenticatedAdmin, upload.single('imageFile'), adminController.postClass) 
router.delete('/classes/:id', authenticatedAdmin, adminController.removeClass)

router.get('/classes/:id/homeworks', authenticatedAdmin, adminController.getHomeworks)
router.get('/classes/:id/homeworks/create', authenticatedAdmin, adminController.createHomework)
router.post('/classes/:id/homeworks', authenticatedAdmin, upload.single('imageFile'), adminController.postHomework)
router.get('/classes/:id/homeworks/:id/edit', authenticatedAdmin, adminController.editHomework)
router.put('/classes/:id/homeworks/:id', authenticatedAdmin, upload.single('imageFile'), adminController.putHomework)
router.delete('/classes/:id/homeworks/:id', authenticatedAdmin, adminController.deleteHomework)

router.get('/users', authenticatedAdmin, userController.getUsers)
router.put('/users/:id/authority', authenticatedAdmin, userController.putUserAuthority)
router.get('/users/:id/edit', authenticatedAdmin, userController.editUser)
router.post('/users/:id/attendclasses', authenticatedAdmin, attendController.addAttendClass)
router.delete('/users/:id/attendclasses/:id', authenticatedAdmin, attendController.deleteAttendClass)

router.get('/voicefiles', authenticatedMentorAndAdmin, voiceFileController.getVoiceFiles)
router.post('/voicefiles/:id/feedbacks', authenticatedMentorAndAdmin, feedbackController.postAdminFeedback)
router.get('/voicefiles/waitingfeedback', authenticatedMentorAndAdmin, voiceFileController.getNoFeedbackVoicefiles)
router.get('/voicefiles/:id/feedbacks', authenticatedMentorAndAdmin, feedbackController.getAdminFeedbacks)
router.get('/voicefiles/:id/feedbacks/:id/edit', authenticatedMentorAndAdmin, feedbackController.editAdminFeedback)
router.put('/voicefiles/:id/feedbacks/:id', authenticatedMentorAndAdmin, feedbackController.putAdminFeedback)
router.get('/voicefiles/:orderby', authenticatedMentorAndAdmin, voiceFileController.getVoiceFiles)

module.exports = router