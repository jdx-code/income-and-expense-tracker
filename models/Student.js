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
    status:{
        type: Number,        
    },
    fee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fee'
    },
    admission_form_img: {
        type: String,
    },
    cloudinaryId: {
        type: String,
    }    
})

module.exports = mongoose.model('Student', StudentSchema)