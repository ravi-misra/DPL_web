const Shift_sch = require("../models/shift_sch");
const Dept = require("../models/department");
const Employee = require("../models/employee");

async function handleShiftPlan(req, res, selection = "") {
    let hodDeps = await Dept.find({ hod: req.user._id });
    let hodObject = {};
    let employeeObject = {};
    for (let d of hodDeps) {
        hodObject[d.costcode] = d.costcode + " - " + d.name;
        let doc = await Employee.find({ dept: d._id });
        let completeList = [];
        for (let e of doc) {
            completeList.push(e.name + " - " + e.username);
        }
        employeeObject[d.costcode] = completeList.sort();
    }
    return { hodObject, employeeObject };
}

module.exports.renderUserManagementPage = async (req, res) => {};
