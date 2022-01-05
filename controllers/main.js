const Shift_sch = require('../models/shift_sch');
const {startOfDay, subDays, format} = require('date-fns');

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
    req.session.cookie.maxAge = 0;
    res.redirect('/home');
}

module.exports.goHome = async (req, res) => {
    let today = startOfDay(new Date());
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
        let dept = item.employee.dept;
        let shift = item.shift;
        let data = [item.employee.name, (item.employee.mobile + ", " + item.employee.alternate_contacts), item.employee.intercom]
        if (item.date === today) {
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
        } else if (item.date === subDays(today , 1)) {
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
    res.render('home', {scheduleObject1, scheduleObject2, date1, date2});
}
// input(todaySchedule) --> [{employee:{name, dept, mobile, alt, intercom}, date, shift, editby, locked}]
// output(scheduleObject1) --> (date1) --> {
// dept1: {
//     'A': [[name, contacts, intercom ], [name, contacts, intercom ]]
// }}// date1, date2
// 