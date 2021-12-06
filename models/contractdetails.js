const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ContractDetailSchema = new Schema({
    wo: {
        type: String,
        required: true,
        unique: true
    },
    from: Date,
    to: Date,
    details: String,
    contractor: {
        type: Schema.Types.ObjectId,
        ref: 'Contractor',
    }
});

module.exports = mongoose.model('ContractDetail', ContractDetailSchema);