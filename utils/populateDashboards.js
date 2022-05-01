const Employee = require("../models/employee");
const Department = require("../models/department");

module.exports = async (user) => {
    let doc, dept;
    let finalDashboard = {},
        userDashboard = {},
        deptDashboard = {};
    if (user.role === "DPLAdmin") {
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
        doc = await Employee.findById(user._id).populate({ path: "dept" });
        if (doc) {
            userDashboard = doc.dashboards;
            if (doc.dept) {
                deptDashboard = doc.dept.dashboards;
            }
            finalDashboard = { ...deptDashboard, ...userDashboard };
        }
    }

    if (Object.keys(finalDashboard).length > 0) {
        return finalDashboard;
    } else {
        return false;
    }
};
