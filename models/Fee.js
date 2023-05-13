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
    amountPaid: {
        type: Number,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },    
})