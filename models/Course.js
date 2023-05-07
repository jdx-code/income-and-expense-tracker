const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
    },
    courseDuration: {
        type: Number,
        required: true,
    },
})

module.exports = mongoose.model('Course', CourseSchema)