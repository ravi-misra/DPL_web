const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContractorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    contactperson: String,
    contact: [Number]
});

module.exports = mongoose.model('Contractor', ContractorSchema);