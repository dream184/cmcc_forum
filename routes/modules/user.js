const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../../controllers/userController.js')
const { authenticated } = require('../../middlewares/auth.js')

router.get('/signin', userController.signInPage)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/user/signin', failureFlash: true }), userController.signin)
router.get('/logout', authenticated, userController.logout)
router.get('/forgotPassword', userController.forgotPasswordPage)
router.post('/forgotPassword', userController.submitForgetPassword)
router.get('/resetPassword', userController.resetPasswordPage)
router.post('/resetPassword', userController.resetPassword)

router.get('/profile', authenticated, userController.getProfile)
router.get('/profile/edit', authenticated, userController.editProfile)
router.put('/profile/:id', authenticated, upload.single('avatar'), userController.putProfile)
router.put('/profile/:id/emailpassword', authenticated, userController.putEmailPassword)

module.exports = router