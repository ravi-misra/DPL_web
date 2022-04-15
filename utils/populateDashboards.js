const Employee = require("../models/employee");

module.exports = async (emp_id) => {
  let doc = await Employee.findById(emp_id).populate({ path: "dept" });
  let finalDashboard, userDashboard, deptDashboard;
  userDashboard = doc.dashboards;
  if (doc.dept) {
    deptDashboard = doc.dept.dashboards;
  }
  finalDashboard = { ...userDashboard, ...deptDashboard };
  return finalDashboard;
};
