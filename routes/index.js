const adminController = require('../controllers/adminController.js')

module.exports = (app) => {
  app.get('/', (req, res) => {res.redirect('admin/classes')})
  app.get('/admin/classes', adminController.getClasses)
  app.get('/admin/classes/create', adminController.createClass)

}