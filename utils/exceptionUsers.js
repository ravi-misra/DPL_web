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
            exceptionUsers[u.user.username] = {
                userId: u.user.username,
                name: u.user.name,
                role: u.user.role,
                type: u.type,
                password: u.password,
                defaultRoute: u.defaultRoute,
                scadaMode: u.scadaMode,
                dashboards: u.user.dashboards,
            };
        }
    }
    return exceptionUsers;
};
