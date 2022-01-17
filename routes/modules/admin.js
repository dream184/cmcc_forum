const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../../controllers/adminController.js')
const attendController = require('../../controllers/attendController.js')
const voiceFileController = require('../../controllers/voiceFileController')
const userController = require('../../controllers/userController.js')
const feedbackController = require('../../controllers/feedbackController.js')

router.get('/classes', adminController.getClasses)
router.get('/classes/create', adminController.createClass)
router.get('/classes/:id/edit', adminController.editClass)
router.put('/classes/:id', upload.single('imageFile'), adminController.putClass)
router.post('/classes', upload.single('imageFile'), adminController.postClass) 
router.delete('/classes/:id', adminController.removeClass)

router.get('/classes/:id/homeworks', adminController.getHomeworks)
router.get('/classes/:id/homeworks/create', adminController.createHomework)
router.post('/classes/:id/homeworks', upload.single('imageFile'), adminController.postHomework)
router.get('/classes/:id/homeworks/:id/edit', adminController.editHomework)
router.put('/classes/:id/homeworks/:id', upload.single('imageFile'), adminController.putHomework)
router.delete('/classes/:id/homeworks/:id', adminController.deleteHomework)

router.get('/users', userController.getUsers)
router.put('/users/:id/authority', userController.putUserAuthority)
router.get('/users/:id/edit', userController.editUser)
router.post('/users/:id/attendclasses', attendController.addAttendClass)
router.delete('/users/:id/attendclasses/:id', attendController.deleteAttendClass)

router.get('/voicefiles', voiceFileController.getVoiceFiles)
router.post('/voicefiles/:id/feedbacks', feedbackController.postAdminFeedback)
router.get('/voicefiles/waitingfeedback', voiceFileController.getNoFeedbackVoicefiles)
router.get('/voicefiles/:id/feedbacks', feedbackController.getAdminFeedbacks)
router.get('/voicefiles/:id/feedbacks/:id/edit', feedbackController.editAdminFeedback)
router.put('/voicefiles/:id/feedbacks/:id', feedbackController.putAdminFeedback)
router.get('/voicefiles/:orderby', voiceFileController.getVoiceFiles)

module.exports = router