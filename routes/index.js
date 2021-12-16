const adminController = require('../controllers/adminController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/'})

module.exports = (app) => {
  app.get('/', (req, res) => {res.redirect('admin/classes')})
  app.get('/admin/classes', adminController.getClasses)
  app.get('/admin/classes/create', adminController.createClass)
  app.post('/admin/classes', upload.single('imageFile'),adminController.postClass)

}