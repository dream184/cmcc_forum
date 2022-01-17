const express = require('express')
const router = express.Router()
const favoriteController = require('../../controllers/favoriteController.js')

router.get('/', favoriteController.getFavoriteVoicefiles)
router.post('/:id', favoriteController.addFavoriteVoicefile)
router.delete('/:id', favoriteController.removeFavoriteVoicefile)

module.exports = router