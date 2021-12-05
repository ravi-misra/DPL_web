const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    costcode: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Department', DepartmentSchema);
