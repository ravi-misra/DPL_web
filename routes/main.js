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
router.get("/home/plo1", main.goHomePlo1);
router.get("/home/plo2", main.goHomePlo2);
router.get("/home/plo3", main.goHomePlo3);
router.get("/home/plo4", main.goHomePlo4);
router.get("/home/ftp", main.goHomeFtp);
router.get("/home/transport", main.goHomeTransport);

module.exports = router;
