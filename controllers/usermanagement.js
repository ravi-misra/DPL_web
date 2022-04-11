const Shift_sch = require("../models/shift_sch");
const Dept = require("../models/department");
const Employee = require("../models/employee");
const ExceptionUser = require("../models/exception_users");
const { defaultPassword } = require("../config");

async function getInitialData(req, res) {
    let hodDeps = await Dept.find({ hod: req.user._id });
    let hodObject = {};
    let employeeObject = {};
    for (let d of hodDeps) {
        hodObject[d.costcode] = d.costcode + " - " + d.name;
        let doc = await Employee.find({ dept: d._id });
        let completeList = [];
        for (let e of doc) {
            if (
                e.username !== req.user.username &&
                req.user.role !== "DPLAdmin"
            ) {
                completeList.push(e.name + " - " + e.username);
            }
        }
        employeeObject[d.costcode] = completeList.sort();
    }
    return { hodObject, employeeObject };
}

module.exports.renderUserManagementPage = async (req, res) => {
    res.render("admin/usermanagement");
};

module.exports.loadInitialData = async (req, res) => {
    let data = await getInitialData(req, res);
    res.json(data);
};

module.exports.resetPassword = async (req, res) => {
    let user = await Employee.findOne({ username: req.body.emp });
    try {
        await user.setPassword(defaultPassword);
        await user.save();
        res.json({
            message: `Password has been reset for: ${req.body.emp}`,
        });
    } catch (e) {
        res.json({ fail: true, message: e });
    }
};


module.exports.getExceptioUsers = async (req, res) => {
    
}