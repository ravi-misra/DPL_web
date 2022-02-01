const express = require('express');
const router = express.Router();
const profile = require("../controllers/profile");
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthorized} = require('../middleware');

router.route("/shift-schedule")
    .get(isLoggedIn, isAuthorized, catchAsync(profile.renderShiftScheduleForm))
    .post(isLoggedIn, isAuthorized, catchAsync(profile.updateShiftSchedule))

router.route("/details")
    .get(isLoggedIn, isAuthorized, profile.renderDetailsForm)
module.exports = router;
