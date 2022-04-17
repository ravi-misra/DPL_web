const ExceptionUser = require("../models/exception_users");
const Employee = require("../models/employee");

//Special kind of users created in db, not to be deleted during DB cleanup
// const exceptionUsers = {
//     caci: {
//         type: "department",
//         password: "ca123",
//         defaultRoute: "/dashboard/transport",
//     },
// };

module.exports.getExceptionUsers = async () => {
    let doc = await ExceptionUser.find({}).populate({ path: "user" });
    let exceptionUsers = {};
    if (doc) {
        for (let u of doc) {
            let emp = await Employee.findOne({ username: u.user.username });
            exceptionUsers[u.user.username] = {
                userId: u.user.username,
                name: emp.name,
                type: u.type,
                password: u.password,
                defaultRoute: u.defaultRoute,
                scadaMode: u.scadaMode,
                dashboards: emp.dashboards,
            };
        }
    }
    return exceptionUsers;
};
