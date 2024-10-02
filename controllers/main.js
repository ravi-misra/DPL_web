const Shift_sch = require("../models/shift_sch");
const { startOfDay, subDays, format, addMinutes } = require("date-fns");
const { deptGroups } = require("../config");
const { getExceptionUsers } = require("../utils/exceptionUsers");

module.exports.renderLogin = (req, res) => {
    res.render("login.ejs");
};

module.exports.login = async (req, res) => {
    if (req.body["remember-checkbox"]) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; //Remember for 1 month
    }
    // req.flash('success', 'Welcome!');
    let redirectUrl = req.session.returnTo || "/home";
    delete req.session.returnTo;
    //Handle exception users
    let exceptionUsers = await getExceptionUsers();
    if (req.user.role && exceptionUsers[req.user.username]) {
        if (req.body["remember-checkbox"]) {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 365 * 50; //Remember for 50 years
        }
        if (exceptionUsers[req.user.username].defaultRoute) {
            redirectUrl = exceptionUsers[req.user.username].defaultRoute;
        }
    }
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    // req.flash('success', "Goodbye!");
    res.redirect("/login");
};

async function homeController(req, res, depList = [], deptName = undefined) {
    let today = startOfDay(new Date());
    today = addMinutes(today, 330);
    let date1 = format(today, "dd/MM/yyyy");
    let date2 = format(subDays(today, 1), "dd/MM/yyyy");
    const todaySchedule = await Shift_sch.find({
        date: { $gte: subDays(today, 1), $lte: today },
    }).populate({
        path: "employee",
        populate: {
            path: "dept",
        },
        select: ["name", "dept", "mobile", "alternate_contacts", "intercom"],
    });
    let scheduleObject1 = {};
    let scheduleObject2 = {};
    for (let item of todaySchedule) {
        //incase of missing employee reference, its value becomes null on populate
        if (!item.employee) {
            continue;
        }
        let dept = item.employee.dept.name;
        let deptCode = item.employee.dept.costcode;
        if (depList.length > 0 && !depList.includes(deptCode)) {
            continue;
        }
        let shift_m = item.shift;
        let alternate_contacts = "",
            intercom = "";
        if (item.employee.alternate_contacts) {
            alternate_contacts = ", " + item.employee.alternate_contacts;
        }
        if (item.employee.intercom) {
            intercom = item.employee.intercom;
        }
        let data = [
            item.employee.name,
            item.employee.mobile + alternate_contacts,
            intercom,
        ];
        for (let shift of shift_m) {
            if (item.date.getDate() === today.getDate()) {
                if (scheduleObject1[dept]) {
                    if (scheduleObject1[dept][shift]) {
                        scheduleObject1[dept][shift].push(data);
                    } else {
                        scheduleObject1[dept][shift] = [];
                        scheduleObject1[dept][shift].push(data);
                    }
                } else {
                    scheduleObject1[dept] = {};
                    scheduleObject1[dept][shift] = [];
                    scheduleObject1[dept][shift].push(data);
                }
            } else if (item.date.getDate() === subDays(today, 1).getDate()) {
                if (scheduleObject2[dept]) {
                    if (scheduleObject2[dept][shift]) {
                        scheduleObject2[dept][shift].push(data);
                    } else {
                        scheduleObject2[dept][shift] = [];
                        scheduleObject2[dept][shift].push(data);
                    }
                } else {
                    scheduleObject2[dept] = {};
                    scheduleObject2[dept][shift] = [];
                    scheduleObject2[dept][shift].push(data);
                }
            }
        }
    }
    res.render("home", {
        scheduleObject1,
        scheduleObject2,
        date1,
        date2,
        deptName,
    });
}

module.exports.goFTP = (req, res) => {
    res.redirect("/dashboard/ftp");
};
module.exports.goHome = (req, res, next) => {
    homeController(req, res).catch(next);
};

module.exports.goHomeCI = (req, res, next) => {
    homeController(req, res, deptGroups.CI, "C&I").catch(next);
};

module.exports.goHomeMechanical = (req, res, next) => {
    homeController(req, res, deptGroups.MECHANICAL, "Mechanical").catch(next);
};

module.exports.goHomeElectrical = (req, res, next) => {
    homeController(req, res, deptGroups.ELECTRICAL, "Electrical").catch(next);
};

module.exports.goHomePlo1 = (req, res, next) => {
    homeController(req, res, deptGroups.PLO1, "PL(O)-1").catch(next);
};

module.exports.goHomePlo2 = (req, res, next) => {
    homeController(req, res, deptGroups.PLO2, "PL(O)-2").catch(next);
};

module.exports.goHomePlo3 = (req, res, next) => {
    homeController(req, res, deptGroups.PLO3, "PL(O)-3").catch(next);
};

module.exports.goHomePlo4 = (req, res, next) => {
    homeController(req, res, deptGroups.PLO4, "PL(O)-4").catch(next);
};

module.exports.goHomeFtp = (req, res, next) => {
    homeController(req, res, deptGroups.FTP, "FTP(O)").catch(next);
};

module.exports.goHomeTransport = (req, res, next) => {
    homeController(req, res, deptGroups.TRANSPORT, "Transport").catch(next);
};
// input(todaySchedule) --> [{employee:{name, dept, mobile, alt, intercom}, date, shift, editby, locked}]
// output(scheduleObject1) --> (date1) --> {
// dept1: {
//     'A': [[name, contacts, intercom ], [name, contacts, intercom ]]
// }}// date1, date2
//
