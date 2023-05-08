const express = require('express')
const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const courseRoutes = require('./routes/course')
const app = express()

require('dotenv').config({ path: './config/.env' })
connectDB()

// Set the view engine as ejs
app.set('view engine', 'ejs')

// Body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Use the following route when user hits the root '/'
app.use('/', homeRoutes)
app.use('/course', courseRoutes)

app.listen(3000, () => {
    console.log('Server running on port 3000')
})