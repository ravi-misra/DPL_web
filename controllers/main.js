const Shift_sch = require('../models/shift_sch');
const {startOfDay, subDays, format, addMinutes} = require('date-fns');
const employee = require('../models/employee');

module.exports.renderLogin = (req, res) => {
    res.render('login.ejs');
}

module.exports.login = (req, res) => {
    if (req.body["remember-checkbox"]) {
        req.session.cookie.maxAge = 1000*60*60*24*30;
    }
    req.flash('success', 'Welcome!');
    const redirectUrl = req.session.returnTo || '/home';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/home');
}

module.exports.goHome = async (req, res) => {
    let today = startOfDay(new Date());
    today = addMinutes(today, 330);
    let date1 = format(today, 'dd/MM/yyyy');
    let date2 = format(subDays(today , 1), 'dd/MM/yyyy');
    const todaySchedule = await Shift_sch.find({date: {$gte: subDays(today , 1), $lte: today}}).populate({
        path: "employee",
        populate: {
            path: "dept",
            select: 'name'
        },
        select: ['name', 'dept', 'mobile', 'alternate_contacts', 'intercom']
    })
    let scheduleObject1 = {};
    let scheduleObject2 = {};
    for (let item of todaySchedule) {
        let dept = item.employee.dept.name;
        let shift_m = item.shift;
        let alternate_contacts = '', intercom = '';
        if(item.employee.alternate_contacts) {
            alternate_contacts = ", " + item.employee.alternate_contacts;
        }
        if(item.employee.intercom) {
            intercom = item.employee.intercoms;
        }
        let data = [item.employee.name, (item.employee.mobile + alternate_contacts), intercom];
        for (let shift of shift_m) {
            if (item.date.getDate() === today.getDate()) {
                if(scheduleObject1[dept]) {
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
            } else if (item.date.getDate() === subDays(today , 1).getDate()) {
                if(scheduleObject2[dept]) {
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
    res.render('home', {scheduleObject1, scheduleObject2, date1, date2});
}
// input(todaySchedule) --> [{employee:{name, dept, mobile, alt, intercom}, date, shift, editby, locked}]
// output(scheduleObject1) --> (date1) --> {
// dept1: {
//     'A': [[name, contacts, intercom ], [name, contacts, intercom ]]
// }}// date1, date2
// 