const Employee = require("../models/employee");
const Department = require("../models/department");

module.exports = async (user) => {
    let finalDashboard = {};
    if (user.role === "DPLAdmin") {
        let doc, dept;
        finalDashboard = {};
        let userDashboard = {},
            deptDashboard = {};
        dept = await Department.find({});
        for (let d of dept) {
            if (d.dashboards) {
                deptDashboard = { ...deptDashboard, ...d.dashboards };
            }
        }
        doc = await Employee.find({});
        for (let e of doc) {
            if (e.dashboards) {
                userDashboard = { ...userDashboard, ...e.dashboards };
            }
        }
        finalDashboard = { ...deptDashboard, ...userDashboard };
    } else {
        let doc, dept;
        finalDashboard = {};
        let userDashboard = {},
            deptDashboard = {};
        //For HoD role add all authorized department dashboards too
        dept = await Department.find({ hod: user._id });
        for (let d of dept) {
            if (d.dashboards) {
                deptDashboard = { ...deptDashboard, ...d.dashboards };
            }
        }
        //For other users add only self department roles
        doc = await Employee.findById(user._id).populate({ path: "dept" });
        if (doc) {
            userDashboard = doc.dashboards;
            if (doc.dept) {
                deptDashboard = { ...deptDashboard, ...doc.dept.dashboards };
            }
        }
        finalDashboard = { ...deptDashboard, ...userDashboard };
    }

    if (Object.keys(finalDashboard).length > 0) {
        return finalDashboard;
    } else {
        return false;
    }
};
