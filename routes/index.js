const adminController = require('../controllers/adminController.js')

module.exports = (app) => {
  app.get('/', adminController.getClasses)
}