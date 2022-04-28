const Dept = require("../models/department");
const Employee = require("../models/employee");
const ExceptionUser = require("../models/exception_users");
const { defaultPassword } = require("../config");
const { getExceptionUsers } = require("../utils/exceptionUsers");
const roles = require("../utils/role");

async function getInitialData(req, res) {
    let hodDeps = await Dept.find({ hod: req.user._id });
    let hodObject = {};
    let employeeObject = {};
    for (let d of hodDeps) {
        hodObject[d.costcode] = d.costcode + " - " + d.name;
        let doc = await Employee.find({ dept: d._id });
        let completeList = [];
        for (let e of doc) {
            if (req.user.role === "DPLAdmin") {
                completeList.push(e.name + " - " + e.username);
            } else if (
                e.username !== req.user.username &&
                e.role !== "DPLAdmin" &&
                e.role !== "HoD"
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
            message: `Password has been reset for: ${user.name}-[${user.username}]`,
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
                exceptionUser.role = req.body.userData.role;
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
                    role: req.body.userData.role,
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
                    exceptionUser.role = req.body.userData.role;
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

module.exports.getAllRoles = (req, res) => {
    res.json(Object.keys(roles));
};

module.exports.updateRoles = async (req, res) => {
    const doc = await Employee.findOne({ username: req.body.emp });
    if (doc) {
        let oldRole = doc.role;
        let newRole = req.body.role;
        if (oldRole === newRole) {
            return res.json({ message: "Role already assigned." });
        } else if (oldRole === "DPLAdmin" || oldRole === "HoD") {
            //Downgrading from HoD or DPLAdmin to other roles
            doc.role = newRole;
            await doc.save();
            await Dept.updateMany({}, { $pullAll: { hod: [doc._id] } });
        } else if (newRole === "DPLAdmin") {
            doc.role = newRole;
            await doc.save();
            await Dept.updateMany({}, { $addToSet: { hod: doc._id } });
        } else if (newRole === "HoD") {
            doc.role = newRole;
            await doc.save();
            await Dept.updateOne(
                { costcode: req.body.dept },
                { $addToSet: { hod: doc._id } }
            );
        } else {
            doc.role = newRole;
            await doc.save();
        }
        res.json({ message: `${doc.name} is now ${newRole}.` });
    } else {
        res.json({ fail: true, message: "Record not found." });
    }
};

module.exports.getDeptParams = async (req, res) => {
    let listDeps = await Dept.find({ hod: req.user._id }).populate({
        path: "hod",
    });
    let deptParams = {}; //{costcode:{ALL PARAMS}}
    for (let d of listDeps) {
        deptParams[d.costcode] = { name: d.name };
        if (d.dashboards) {
            deptParams[d.costcode].dashboards = d.dashboards;
        }
        if (d.hod) {
            deptParams[d.costcode].hod = [];
            for (let e of d.hod) {
                if (e.role !== "DPLAdmin") {
                    deptParams[d.costcode].hod.push(e.username);
                }
            }
        }
    }
    res.json(deptParams);
};

module.exports.updateDeptParams = async (req, res) => {
    //req.body = {costcode:xxx,params:xxxx}
    try {
        let dept = await Dept.findOne({ costcode: req.body.costcode });
        for (let p of Object.keys(req.body.params)) {
            if (dept[p]) {
                if (p === "hod") {
                    let hodArray = [...new Set(req.body.params[p])];
                    let listDPLAdmins = await Employee.find({
                        role: "DPLAdmin",
                    });
                    for (let a of listDPLAdmins) {
                        if (!hodArray.includes(a.username)) {
                            hodArray.push(a.username);
                        }
                    }
                    hodArray = await Promise.allSettled(
                        hodArray.map(async (e) => {
                            try {
                                let emp = await Employee.findOne({
                                    username: e,
                                });
                                if (
                                    emp.role === "HoD" ||
                                    emp.role === "DPLAdmin"
                                ) {
                                    return emp._id;
                                } else {
                                    return false;
                                }
                            } catch {
                                return false;
                            }
                        })
                    );
                    hodArray = hodArray.map((e) => e.value);
                    dept[p] = hodArray.filter((o) => o);
                } else if (p !== "costcode") {
                    dept[p] = req.body.params[p];
                }
            }
        }
        await dept.save();
        res.json({
            message: `Department: ${dept.costcode} parameters updated.`,
        });
    } catch (e) {
        console.log(e);
        res.json({ fail: true, message: e });
    }
};
