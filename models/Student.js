const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
    },
    lastExamPassed: {
        type: String,
        required: true,
    },
    courseEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    enrollmentDate: {
        type: Date,
        default: Date.now,
    },    
})