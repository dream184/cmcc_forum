const express = require('express')
const router = express.Router()

router.use('/', (req, res) => {
  return res.redirect('/classes')
})

module.exports = router