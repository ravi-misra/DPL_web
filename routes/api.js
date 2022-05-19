const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api_controller");
const catchAsync = require("../utils/catchAsync");

router.route("/ca/gap2").post(catchAsync(apiController.saveGap2AnodeData));
router.route("/ca/gap1").post(catchAsync(apiController.saveGap1AnodeData));

module.exports = router;
