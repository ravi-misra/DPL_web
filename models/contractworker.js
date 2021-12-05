const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContractWorkerSchema = new Schema({
    passno: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    dutyarea: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['M', 'F'],
        default: 'M'
    },
    validity: Date,
    contractor: {
        type: Schema.Types.ObjectId,
        ref: 'Contractor',
        required: true
    },
    job: String,
    reports_to: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    mobile: Number,
    esi: String
})

module.exports = mongoose.model('ContractWorker', ContractWorkerSchema);