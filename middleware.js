module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.isAuthorized = (req, res, next) => {
    if (!res.locals.allowedURLs.includes(req.originalUrl)) {
        req.flash("error", "Unauthorized request");
        return res.redirect("/");
    }
    next();
};

module.exports.isDPLAdmin = (req, res, next) => {
    if (req.user.role !== "DPLAdmin") {
        return res.end();
    }
    next();
};

module.exports.isHOD = (req, res, next) => {
    if (req.user.role !== "HoD" && req.user.role !== "DPLAdmin") {
        return res.end();
    }
    next();
};

module.exports.checkRequest = (req, res, next) => {
    console.log(res.locals.allowedURLs);
    next();
};
