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
    let exceptionUsers = await getExceptionUsers();
    res.json(exceptionUsers);
};

module.exports.updateExceptioUsersData = async (req, res) => {
    let exceptionUser;
    let exceptionUserDashboard, exceptionUserDeafaultRoute;
    try {
        if (
            req.body.userData.dashboards &&
            typeof req.body.userData.dashboards === "object" &&
            Object.keys(req.body.userData.dashboards).length > 0
        ) {
            exceptionUserDashboard = req.body.userData.dashboards;
        }
        if (
            exceptionUserDashboard &&
            req.body.userData.defaultRoute &&
            Object.values(exceptionUserDashboard).includes(
                req.body.userData.defaultRoute
            )
        ) {
            exceptionUserDeafaultRoute = req.body.userData.defaultRoute;
        }
        if (req.body.username === "addNew") {
            exceptionUser = await Employee.findOne({
                username: req.body.userData.userId,
            });
            if (exceptionUser) {
                exceptionUser.name = req.body.userData.name;
                exceptionUser.dashboards = exceptionUserDashboard;
                await exceptionUser.setPassword(req.body.userData.password);
                await exceptionUser.save();
                let exceptionAccount = await ExceptionUser.findOne({
                    user: exceptionUser._id,
                });
                if (exceptionAccount) {
                    exceptionAccount.type = req.body.userData.type;
                    exceptionAccount.password = req.body.userData.password;
                    exceptionAccount.defaultRoute = exceptionUserDeafaultRoute;
                    exceptionAccount.scadaMode = req.body.userData.scadaMode;
                    await exceptionAccount.save();
                } else {
                    exceptionAccount = new ExceptionUser({
                        user: exceptionUser._id,
                        type: req.body.userData.type,
                        password: req.body.userData.password,
                        defaultRoute: exceptionUserDeafaultRoute,
                        scadaMode: req.body.userData.scadaMode,
                    });
                    await exceptionAccount.save();
                }
            } else {
                let newExceptionUser = new Employee({
                    username: req.body.userData.userId,
                    name: req.body.userData.name,
                    dashboards: exceptionUserDashboard,
                });
                await newExceptionUser.save();
                let exceptionAccount = new ExceptionUser({
                    user: newExceptionUser._id,
                    type: req.body.userData.type,
                    password: req.body.userData.password,
                    defaultRoute: exceptionUserDeafaultRoute,
                    scadaMode: req.body.userData.scadaMode,
                });
                await exceptionAccount.save();
            }
        } else {
            exceptionUser = await Employee.findOne({
                username: req.body.username,
            });
            if (exceptionUser) {
                if (req.body.deleteUser) {
                    await ExceptionUser.findOneAndDelete({
                        user: exceptionUser._id,
                    });
                    await Employee.findOneAndDelete({
                        username: req.body.username,
                    });
                } else {
                    exceptionUser.name = req.body.userData.name;
                    exceptionUser.dashboards = exceptionUserDashboard;
                    await exceptionUser.setPassword(req.body.userData.password);
                    await exceptionUser.save();
                    let exceptionAccount = await ExceptionUser.findOne({
                        user: exceptionUser._id,
                    });
                    if (exceptionAccount) {
                        exceptionAccount.type = req.body.userData.type;
                        exceptionAccount.password = req.body.userData.password;
                        exceptionAccount.defaultRoute =
                            exceptionUserDeafaultRoute;
                        exceptionAccount.scadaMode =
                            req.body.userData.scadaMode;
                        await exceptionAccount.save();
                    } else {
                        exceptionAccount = new ExceptionUser({
                            user: exceptionUser._id,
                            type: req.body.userData.type,
                            password: req.body.userData.password,
                            defaultRoute: exceptionUserDeafaultRoute,
                            scadaMode: req.body.userData.scadaMode,
                        });
                        await exceptionAccount.save();
                    }
                }
            }
        }
        res.json({ message: "User updated successfully." });
    } catch (err) {
        res.json({ fail: true, message: err });
    }
};
