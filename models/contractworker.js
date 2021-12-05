const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    pass_no: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['M', 'F'],
        default: 'M'
    },
    validity: Date,
    contractor: {
        type: Schema.Types.ObjectId,
        ref: 'Contractor'
    },
    job: [{
        type: Schema.Types.ObjectId,
        ref: 'Contract_job'
    }],
    reports_to: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    mobile: Number,
    esi: String
})