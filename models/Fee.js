const mongoose = require('mongoose')

const FeeSchema = new mongoose.Schema({    
    studentInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    courseInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    admissionFeesAmount: {
        type: Number,        
    },
    monthlyFeesAmount: {
        type: Number,
        required: true,
    },
    examFeesAmount: {
        type: Number,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },    
})

module.exports = mongoose.model('Fee', FeeSchema)