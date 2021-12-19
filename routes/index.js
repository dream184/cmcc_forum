const adminController = require('../controllers/adminController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/'})

module.exports = (app) => {
  
  app.get('/', (req, res) => {res.redirect('admin/classes')})
  app.get('/admin/classes', adminController.getClasses)
  app.get('/admin/classes/create', adminController.createClass)
  app.get('/admin/classes/:id/edit', adminController.editClass)

  app.put('/admin/classes/:id', upload.single('imageFile'), adminController.putClass)

  app.post('/admin/classes', upload.single('imageFile'), adminController.postClass)
  
  app.delete('/admin/classes/:id', adminController.removeClass)

  app.get('/admin/classes/:id/homeworks',adminController.getHomeworks)
  app.get('/admin/classes/:id/homeworks/create', adminController.createHomework)
  app.post('/admin/classes/:id/homeworks', upload.single('imageFile'), adminController.postHomework)
  app.get('/admin/classes/:id/homeworks/:id/edit', adminController.editHomework)
  app.put('/admin/classes/:id/homeworks/:id', upload.single('imageFile'), adminController.putHomework)
  app.delete('/admin/classes/:id/homeworks/:id', adminController.deleteHomework )
}


