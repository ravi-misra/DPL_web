const express = require('express');
const router = express.Router();
const {addDays,format, startOfDay} = require('date-fns');
const Shift_sch = require('../models/shift_sch');

module.exports.renderShiftScheduleForm = async (req, res) => {
    const today = startOfDay(new Date());
    const scheduledShifts = {};
    const data = await Shift_sch.find({employee: req.user._id, date: {$gte: today, $lte: addDays(today, 29)}});
    for (let i of data) {
        scheduledShifts[format(i.date, 'dd/MM/yyyy')] = i.shift;
    }
    res.render('profile/shift-schedule-form', scheduledShifts, today, addDays, format);
}
