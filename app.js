const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {PORT, LOCAL_HOST, PLCI_HOST} = require('./config');

// const host = PLCI_HOST;
const host = LOCAL_HOST;

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(flash());


app.get('/', (req, res) => {
    res.render('users/shift-schedule-form.ejs');
})

app.listen(PORT, host, () => {
    console.log(`Listening at ${host}:${PORT}`);
});