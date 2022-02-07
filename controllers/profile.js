const express = require('express');
const router = express.Router();
const {addDays,format, startOfDay} = require('date-fns');
const Shift_sch = require('../models/shift_sch');

module.exports.renderShiftScheduleForm = async (req, res) => {
    const today = startOfDay(new Date());
    const scheduledShifts = {};
    const data = await Shift_sch.find({employee: req.user._id, date: {$gte: today, $lte: addDays(today, 30)}});
    for (let i of data) {
        scheduledShifts[format(i.date, 'dd/MM/yyyy')] = i.shift;
    }
    res.render('profile/shift-schedule-form', {scheduledShifts, today, addDays, format});
}

// Variables passed:-
//     {addDays,format} = require('date-fns');// scheduledShifts = {date('dd/MM/yyyy'): [shifts]}// today 
//     Post:
//     {date1:{date: 'yyyy-MM-dd', shift: {'A': 'on', 'B': 'on'}}, date2:}

module.exports.updateShiftSchedule = async (req, res) => {
    const body = req.body;
    delete body.button;
    for (let i of Object.keys(body)) {
        if (body[i]['shift']) { 
            let checker = (arr, target) => target.every(v => arr.includes(v));
            if (checker(res.locals.validShifts, Object.keys(body[i]['shift']))) {
                let filter = {employee: req.user._id, date: new Date(body[i]['date'])};
                let update = {shift: Object.keys(body[i]['shift'])};
                let doc = await Shift_sch.findOneAndUpdate(filter, update, {
                    new: true,
                    upsert: true
                });
                await doc.save();
            }
        } else {
            let filter = {employee: req.user._id, date: new Date(body[i]['date'])};
            let doc = await Shift_sch.findOneAndDelete(filter);
        }
    }
    req.flash('success', "Shift schedule updated.");
    res.redirect('/profile/shift-schedule');
}

module.exports.renderDetailsForm = (req, res) => {
    res.render('profile/details');
}

module.exports.renderPasswordForm = (req, res) => {
    res.render('profile/change-password');
}

module.exports.updatePassword = async (req, res) => {
    if(req.body.new != req.body.new1) {
        req.flash('error', "New passwords don't match");
        return res.redirect('/profile/change-password');
    }
    await req.user.changePassword(req.body.old, req.body.new);
    req.flash('success', "Password updated");
    res.redirect('/home');
}