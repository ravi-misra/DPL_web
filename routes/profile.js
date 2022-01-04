const express = require('express');
const router = express.Router();
const profile = require("../controllers/profile");

router.route("/shift-schedule")
    .get(profile.renderShiftScheduleForm)
    .post(profile.updateShiftSchedule)

module.exports = router;
