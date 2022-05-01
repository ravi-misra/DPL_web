const express = require("express");
const router = express.Router();
const passport = require("passport");
const main = require("../controllers/main");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthorized } = require("../middleware");

router.get("/", main.goHome);

router
    .route("/login")
    .get(main.renderLogin)
    .post(
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        catchAsync(main.login)
    );

router.get("/logout", isLoggedIn, main.logout);

router.get("/home", main.goHome);

router.get("/home/ci", main.goHomeCI);

router.get("/home/mechanical", main.goHomeMechanical);

router.get("/home/electrical", main.goHomeElectrical);

module.exports = router;
