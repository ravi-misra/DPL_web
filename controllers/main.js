const Employee = require('../models/employee');

module.exports.renderLogin = (req, res) => {
    res.render('login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome!');
    const redirectUrl = req.session.returnTo || '/home';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/home');
}

module.exports.goHome = (req, res) => {
    res.render('home');
}

// {dept1:{A:[[name, designation, mob],]}}