const express = require('express')
const router = express.Router()
const frontsideController = require('../../controllers/frontsideController')
const voiceFileController = require('../../controllers/voiceFileController')
const feedbackController = require('../../controllers/feedbackController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/', frontsideController.getClasses)
router.get('/:id', frontsideController.getHomeworks)
router.get('/:id/homeworks/:id', frontsideController.getHomework)
router.post('/:id/homeworks/:id/uploadVoiceFile', upload.single('voiceFile'), voiceFileController.postVoiceFile)
router.delete('/:id/homeworks/:id/voicefiles/:id', voiceFileController.deleteVoiceFile)

router.get('/:id/homeworks/:id/voicefiles/:id/feedbacks', feedbackController.getFeedbacks)
router.post('/:id/homeworks/:id/voicefiles/:id/feedbacks', feedbackController.postFeedback)
router.get('/:id/homeworks/:id/voicefiles/:id/feedbacks/:id/edit', feedbackController.editFeedback)
router.put('/:id/homeworks/:id/voicefiles/:id/feedbacks/:id', feedbackController.putFeedback)
router.delete('/:id/homeworks/:id/voicefiles/:id/feedbacks/:id', feedbackController.deleteFeedback)

module.exports = router