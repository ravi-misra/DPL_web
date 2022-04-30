const express = require("express");
const router = express.Router();
const shiftplan = require("../controllers/shiftplan");
const usermanagement = require("../controllers/usermanagement");
const catchAsync = require("../utils/catchAsync");
const {
    isLoggedIn,
    isAuthorized,
    isDPLAdmin,
    isHOD,
} = require("../middleware");

router
    .route("/shift-plan")
    .get(isLoggedIn, isAuthorized, catchAsync(shiftplan.renderShiftPlanForm))
    .post(isLoggedIn, isAuthorized, catchAsync(shiftplan.uploadShiftPlan));

router
    .route("/shift-feed/:username")
    .get(isLoggedIn, isHOD, catchAsync(shiftplan.renderShiftFeedForm))
    .post(isLoggedIn, isHOD, catchAsync(shiftplan.updateShiftFeed));
////////////////////////////////////////////////////////////////////////////////
//User Management routes
////////////////////////////////////////////////////////////////////////////////

router
    .route("/user-management")
    .get(
        isLoggedIn,
        isHOD,
        catchAsync(usermanagement.renderUserManagementPage)
    );

router
    .route("/user-management/api/get-employee-data")
    .post(isLoggedIn, isHOD, catchAsync(usermanagement.loadInitialData));

router
    .route("/user-management/api/password-reset")
    .post(isLoggedIn, isHOD, catchAsync(usermanagement.resetPassword));

router
    .route("/user-management/api/exception-users")
    .get(
        isLoggedIn,
        isDPLAdmin,
        catchAsync(usermanagement.getExceptioUsersData)
    )
    .post(
        isLoggedIn,
        isDPLAdmin,
        catchAsync(usermanagement.updateExceptioUsersData)
    );

router
    .route("/user-management/api/roles")
    .get(isLoggedIn, isDPLAdmin, usermanagement.getAllRoles)
    .post(isLoggedIn, isDPLAdmin, catchAsync(usermanagement.updateRoles));

router
    .route("/user-management/api/dept-params")
    .get(isLoggedIn, isDPLAdmin, catchAsync(usermanagement.getDeptParams))
    .post(isLoggedIn, isDPLAdmin, catchAsync(usermanagement.updateDeptParams));

module.exports = router;
