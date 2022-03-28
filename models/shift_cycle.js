const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShiftCycle3WeekSchema = new Schema({
    dept: {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    shift: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("ShiftCycle3Week", ShiftCycle3WeekSchema);
