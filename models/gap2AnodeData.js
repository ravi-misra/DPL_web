const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Gap2AnodeDataSchema = new Schema({
    DateAndTime: {
        type: Date,
        required: true,
    },
    Shift: Number,
    Ejection_Day: Number,
    Ejection_Time: String,
    Module_Number: Number,
    Anode_Number: Number,
    Anode_Number2: Number,
    Height_mm: Number,
    Weight_Kg: Number,
    Appar_Dencity: Number,
    Dry_Dencity: Number,
    PHS_Temp: Number,
    Mixer_Temp: Number,
    Mixer_Power: Number,
    Paste_Temp: Number,
    Pitch_Temp: Number,
    Pitch: Number,
    Reject_Code: Number,
    Height_mm_Dev: Number,
    Weight_Kg1_Dev: Number,
    Appar_Dencity_Dev: Number,
    Dry_Dencity_Dev: Number,
    TotalDryProduct: Number,
    TDP_MP_Ratio: Number,
});

module.exports = mongoose.model("Gap2AnodeData", Gap2AnodeDataSchema);
