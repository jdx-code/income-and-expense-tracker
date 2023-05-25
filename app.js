const express = require('express')
const methodOverride = require('method-override')
const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const courseRoutes = require('./routes/course')
const ccetRoutes = require('./routes/ccet')

const app = express()

require('dotenv').config({ path: './config/.env' })
connectDB()

// Set the view engine as ejs
app.set('view engine', 'ejs')

// Body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Express automatically making route for static files in public directory
app.use(express.static('public'));

// Use the following route when user hits the root '/'
app.use('/', homeRoutes)
app.use('/course', courseRoutes)
app.use('/ccet', ccetRoutes)


app.listen(3000, () => {
    console.log('Server running on port 3000')
})