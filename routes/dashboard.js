const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/dashboard");
const { isLoggedIn, isAuthorized } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router
    .route("/transport")
    .get(isLoggedIn, isAuthorized, catchAsync(dashboard.renderTransportDept));

module.exports = router;
