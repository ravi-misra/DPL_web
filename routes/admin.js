const express = require("express");
const router = express.Router();
const shiftplan = require("../controllers/shiftplan");
const usermanagement = require("../controllers/usermanagement");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthorized } = require("../middleware");

router
    .route("/shift-plan")
    .get(isLoggedIn, isAuthorized, catchAsync(shiftplan.renderShiftPlanForm))
    .post(isLoggedIn, isAuthorized, catchAsync(shiftplan.uploadShiftPlan));

////////////////////////////////////////////////////////////////////////////////
//User Management rotes
////////////////////////////////////////////////////////////////////////////////

router
    .route("/user-management")
    .get(isLoggedIn, catchAsync(usermanagement.renderUserManagementPage));

router
    .route("/user-management/api/get-employee-data")
    .post(isLoggedIn, catchAsync(usermanagement.loadInitialData));

router
    .route("/user-management/api/password-reset")
    .post(isLoggedIn, catchAsync(usermanagement.resetPassword));

router
    .route("/user-management/api/exception-users")
    .get(isLoggedIn, catchAsync(usermanagement.getExceptioUsersData))
    .post(isLoggedIn, catchAsync(usermanagement.updateExceptioUsersData));

module.exports = router;
