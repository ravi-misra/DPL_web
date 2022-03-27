const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExceptionUser = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
        unique: true,
    },
    type: String,
    password: String,
    defaultRoute: String,
    scadaMode: Boolean,
});

module.exports = mongoose.model("Exception_user", ExceptionUser);
