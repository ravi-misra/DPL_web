const Dept = require("../models/department");
const Employee = require("../models/employee");
const ExceptionUser = require("../models/exception_users");
const { defaultPassword } = require("../config");
const { getExceptionUsers } = require("../utils/exceptionUsers");

async function getInitialData(req, res) {
    let hodDeps = await Dept.find({ hod: req.user._id });
    let hodObject = {};
    let employeeObject = {};
    for (let d of hodDeps) {
        hodObject[d.costcode] = d.costcode + " - " + d.name;
        let doc = await Employee.find({ dept: d._id });
        let completeList = [];
        for (let e of doc) {
            if (e.username !== req.user.username) {
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

module.exports.getExceptioUsersData = async (req, res) => {
    let exceptionUsers = getExceptionUsers();
    res.json(exceptionUsers);
};

module.exports.updateExceptioUsersData = async (req, res) => {
    console.log(req.body);
    let exceptionUser;
    if (req.body.username === "addNew") {
        exceptionUser = await Employee.findOne({
            username: req.body.userData.userId,
        });
        if (exceptionUser) {
            exceptionUser.name = req.body.userData.name;
            if (
                req.body.userData.dashboards &&
                typeof req.body.userData.dashboards === "object" &&
                Object.keys(req.body.userData.dashboards).length > 0
            ) {
                exceptionUser.dashboards = req.body.userData.dashboards;
            }
            await exceptionUser.setPassword(req.body.userData.password);
            await exceptionUser.save();
            let exceptionAccount = await ExceptionUser.findOne({
                user: exceptionUser._id,
            });
            if (exceptionAccount) {
                exceptionAccount.type = req.body.userData.type;
                exceptionAccount.password = req.body.userData.password;
                exceptionAccount.defaultRoute = req.body.userData.defaultRoute;
                exceptionAccount.scadaMode = req.body.userData.scadaMode;
                await exceptionAccount.save();
            } else {
                exceptionAccount = new ExceptionUser({
                    user: exceptionUser._id,
                    type: req.body.userData.type,
                    password: req.body.userData.password,
                    defaultRoute: req.body.userData.defaultRoute,
                    scadaMode: req.body.userData.scadaMode,
                });
                await exceptionAccount.save();
            }
        }
    }
    res.json({ message: "User updated successfully." });
};
