const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    costcode: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    area: {
        type: String
    },
    dashboards: [{
        type: String
    }]
});

module.exports = mongoose.model('Department', DepartmentSchema);
