const express = require('express');
const router = express.Router();
const passport = require('passport');
const main = require('../controllers/main');


router.route('/login')
    .get(main.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), main.login)

router.get('/logout', main.logout)

router.get('/home', main.goHome)

module.exports = router;