const express = require('express');
const router = express.Router();
const profile = require("../controllers/profile");
const catchAsync = require('../utils/catchAsync')

router.route("/shift-schedule")
    .get(catchAsync(profile.renderShiftScheduleForm))
    .post(catchAsync(profile.updateShiftSchedule))

module.exports = router;
