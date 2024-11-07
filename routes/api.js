const express = require("express");
const router = express.Router();
const apiController = require("../controllers/ftp_api");
const catchAsync = require("../utils/catchAsync");
const {
    isLoggedIn,
    isAuthorized,
    isDPLAdmin,
    isHOD,
    checkRequest,
} = require("../middleware");

// router.route("/ca/gap2").post(catchAsync(apiController.saveGap2AnodeData));
// router.route("/ca/gap1").post(catchAsync(apiController.saveGap1AnodeData));
// router
//     .route("/potline/process-data")
//     .post(catchAsync(apiController.uploadPotData));
router
    .route("/ftp/select-report")
    .post(isLoggedIn, isAuthorized, catchAsync(apiController.uploadPdfReport));
router
    .route("/ftp/manual-entry")
    .post(isLoggedIn, isAuthorized, catchAsync(apiController.serveBlankForm));
router
    .route("/ftp/submit-report")
    .post(isLoggedIn, isAuthorized, catchAsync(apiController.serveBlankForm));

module.exports = router;
