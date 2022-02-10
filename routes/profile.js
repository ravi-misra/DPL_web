const express = require('express');
const router = express.Router();
const profile = require("../controllers/profile");
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthorized} = require('../middleware');

router.route("/shift-schedule")
    .get(isLoggedIn, isAuthorized, catchAsync(profile.renderShiftScheduleForm))
    .post(isLoggedIn, isAuthorized, catchAsync(profile.updateShiftSchedule))

router.route("/details")
    .get(isLoggedIn, isAuthorized, catchAsync(profile.renderDetailsForm))
    .post(isLoggedIn, isAuthorized, catchAsync(profile.updateDetails))

router.route("/change-password")
    .get(isLoggedIn, isAuthorized, profile.renderPasswordForm)
    .post(isLoggedIn, isAuthorized, catchAsync(profile.updatePassword))

module.exports = router;
