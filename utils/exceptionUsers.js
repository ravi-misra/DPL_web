//Special kind of users created in db, not to be deleted during DB cleanup
const exceptionUsers = {
    "caci": {
        type: "department",
        password: "ca123",
        defaultRoute: "/dashboard/transport"
    }
}

module.exports = exceptionUsers;