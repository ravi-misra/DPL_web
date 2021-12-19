const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShiftScheduleSchema = new mongoose.Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    shift: [{
        type: String,
        required: true
    }],
    editby: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
    },
    locked: {
        type: Boolean,
        default: false
    }
})

ShiftScheduleSchema.set('timestamps', true);

module.exports = mongoose.model('ShiftSchedule', ShiftScheduleSchema);