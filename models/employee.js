const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const EmployeeSchema = new Schema({
    username: {
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
        enum: ['M', 'F']
    },
    role: String,
    active: {
        type: Boolean,
        default: true
    },
    reports_to: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    dob: Date,
    doj: Date,
    mobile: {
        type: String,
        default: ''
    },
    alternate_contacts: {
        type: String,
        default: ''
    },
    intercom: String,
    qtr_no: String,
    blood_grp: String
})

EmployeeSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Employee', EmployeeSchema);