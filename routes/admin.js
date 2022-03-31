const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthorized } = require("../middleware");

router
    .route("/shift-plan")
    .get(isLoggedIn, isAuthorized, catchAsync(admin.renderShiftPlanForm))
    .post(isLoggedIn, isAuthorized, catchAsync(admin.uploadShiftPlan));

module.exports = router;
