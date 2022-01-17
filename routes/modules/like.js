const express = require('express')
const router = express.Router()
const likeController = require('../../controllers/likeController.js')

router.post('/:id', likeController.addLike)
router.delete('/:id', likeController.removeLike)

module.exports = router