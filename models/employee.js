const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    pn: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    dept: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['M', 'F']
    },
    auth_level: {
        type: Schema.Types.ObjectId,
        ref: 'Authority',
        required: true
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    dob: Date,
    doj: Date,
    mobile: Number,
    alternate_contacts: [Number],
    intercom: Number,
    qtr_no: String,
    blood_grp: String,
    password: String
})

module.exports = mongoose.model('Employee', employeeSchema);

