const express = require('express');
const router = express.Router();
const dashboard = require("../controllers/dashboard");
const {isLoggedIn, isAuthorized} = require('../middleware');

router.route("/transport")
    .get(isLoggedIn, isAuthorized, dashboard.renderTransportDept)

module.exports = router;