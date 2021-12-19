const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CasualAttendanceSchema = new mongoose.Schema({
    casual: {
        type: Schema.Types.ObjectId,
        ref: 'ContractWorker',
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
    }
})

CasualAttendanceSchema.set('timestamps', true);

module.exports = mongoose.model('ShiftSchedule', ShiftScheduleSchema);