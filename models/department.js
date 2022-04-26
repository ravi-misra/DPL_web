const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    costcode: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    area: {
        type: String,
    },
    dashboards: Schema.Types.Mixed, //{key(name of submenu item): value(link for that item), }
    hod: [
        {
            type: Schema.Types.ObjectId,
            ref: "Employee",
        },
    ],
});

module.exports = mongoose.model("Department", DepartmentSchema);
