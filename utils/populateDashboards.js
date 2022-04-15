const Employee = require("../models/employee");

module.exports = async (emp_id) => {
    let doc = await Employee.findById(emp_id).populate({ path: "dept" });
    // console.log(doc);
    let finalDashboard = {},
        userDashboard = {},
        deptDashboard = {};
    if (doc) {
        userDashboard = doc.dashboards;
        if (doc.dept) {
            deptDashboard = doc.dept.dashboards;
        }
        finalDashboard = { ...deptDashboard, ...userDashboard };
    }

    if (Object.keys(finalDashboard).length > 0) {
        return finalDashboard;
    } else {
        return false;
    }
};
