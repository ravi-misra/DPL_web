const { getExceptionUsers } = require("../utils/exceptionUsers");

module.exports.renderTransportDept = async (req, res) => {
    let exceptionUsers = await getExceptionUsers();
    let scadaMode;
    if (req.user.role && exceptionUsers[req.user.username]) {
        if (exceptionUsers[req.user.username].scadaMode) {
            scadaMode = true;
        }
    }
    res.render("dashboards/dept_transport.ejs", { scadaMode });
};
