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
    res.render('profile/shift-schedule-form', {scheduledShifts, today, addDays: addDays, format: addDays});
}

module.exports.updateShiftSchedule = async (req, res) => {
    const body = req.body;
    for (let i of Object.keys(body)) {
        if (Object.keys(body[i]['shift']).length > 0) {
            let filter = {_id: req.user._id, date: new Date(body[i]['date'])};
            let update = {shift: Object.keys(body[i]['shift'])};
            let doc = await Shift_sch.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            });
            await doc.save();
        }
    }
}