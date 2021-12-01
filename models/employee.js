const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    pn: {
        type: String,
        required: true
    }
})

const Employee = mongoose.model('Employee', employeeSchema);

