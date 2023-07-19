const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
    },
    courseDuration: {
        type: String,
        required: true,
    },
    courseFees: {
        type: Number,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
      },
})

module.exports = mongoose.model('Course', CourseSchema)