const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    pn: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    dept_code: {
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
        enum: ['M', 'F']
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

const Employee = mongoose.model('Employee', employeeSchema);

