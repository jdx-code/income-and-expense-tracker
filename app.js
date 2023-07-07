const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash')
const logger = require('morgan')
const methodOverride = require('method-override')
const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const ccetRoutes = require('./routes/ccet')

const app = express()

require('dotenv').config({ path: './config/.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

// Set the view engine as ejs
app.set('view engine', 'ejs')

// Body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))

// Session
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:  new MongoStore({ mongooseConnection: mongoose.connection })
  
  })
)
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Method override
app.use(methodOverride("_method"))

// Express automatically making route for static files in public directory
app.use(express.static('public'));

// Use the following route when user hits the root '/'
app.use('/', homeRoutes)
app.use('/ccet', ccetRoutes)


app.listen(3000, () => {
    console.log('Server running on port 3000')
})