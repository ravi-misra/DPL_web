const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShiftCycle3WeekSchema = new Schema({
    dept: {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    shift_cycle_ref: {
        type: Date,
        required: true,
    },
    next_start_ref: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("ShiftCycle3Week", ShiftCycle3WeekSchema);
