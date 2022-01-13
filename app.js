const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const session = require('express-session')
var favicon = require('serve-favicon')
const flash = require('connect-flash')
const redis = require('redis')
const client = redis.createClient();
const hbsHelpers = require('./config/handlebars-helpers')
const passport = require('./config/passport')
const path = require('path')
const app = express()

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('hbs', exphbs.engine({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: hbsHelpers
}))
app.set('view engine', 'hbs')

app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})


app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`)
})
require('./routes')(app, passport)

module.exports = app