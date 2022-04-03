const express = require("express");
const router = express.Router();
const shiftplan = require("../controllers/shiftplan");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthorized } = require("../middleware");

router
    .route("/shift-plan")
    .get(isLoggedIn, isAuthorized, catchAsync(shiftplan.renderShiftPlanForm))
    .post(isLoggedIn, isAuthorized, catchAsync(shiftplan.uploadShiftPlan));

module.exports = router;
