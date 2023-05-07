const express = require('express')
const homeRoutes = require('./routes/home')
const courseRoutes = require('./routes/course')
const app = express()

// Use the following route when user hits the root '/'
app.use('/', homeRoutes)
app.use('/course', courseRoutes)

app.listen(3000, () => {
    console.log('Server running on port 3000')
})