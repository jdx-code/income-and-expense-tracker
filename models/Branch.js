const mongoose = require('mongoose')

const BranchSchema = new mongoose.Schema({
    branchName: {
        type: String,
        required: true,
    }, 
    branchAddress: {
        type: String,
        required: true,
    },
    centerInCharge: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: Number,        
    },
    email: {
        type: String,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Branch', BranchSchema)