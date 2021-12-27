

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthorized = (req, res, next) => {
    if (!allowedURLs.includes(req.originalUrl)) {
        req.flash('error', 'Unauthorized request');
        return res.redirect('/home');
    }
    next();
}
