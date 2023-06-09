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
    totalFeesPaid: {
        type: Array,
        required: true,
    },
    examFeesAmount: {
        type: Number,
    },
    paymentDates: {
        type: Array,        
    },                                                                                                                                                                
})

module.exports = mongoose.model('Fee', FeeSchema)