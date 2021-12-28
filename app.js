const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressErrors');
const roles = require('./utils/role');
const {PORT, LOCAL_HOST, PLCI_HOST, DB_URL} = require('./config');

// const host = PLCI_HOST;
const host = LOCAL_HOST;
const validShifts = ['A', 'B', 'C', 'G', 'WO', 'M', 'N'];

//express middlewares
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

//MongoDB connections
dbConnect().catch(err => console.log(err));
async function dbConnect() {
    await mongoose.connect(DB_URL);
    console.log('Database connected.');
}

//View and templating engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//session configuration
const store = MongoStore.create({ 
    clientPromise: mongoose.connection.asPromise().then(c => c.getClient()),
    touchAfter: 24*3600 // time period in seconds
});

const sessionConfig = {
    store,
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // maxAge: 1000*60*60*24*7, // time period in miliseconds
    }
}

app.use(session(sessionConfig));
app.use(flash());


//passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    let allowedURLs = [];
    res.locals.currentUser = req.user;
    if (req.user && req.user.role) {
        res.locals.role = roles[req.user.role];
        if (res.locals.role) {
            for (let i of Object.keys(res.locals.role)) {
                if (typeof res.locals.role[i] === 'string') {
                    allowedURLs.push(res.locals.role[i]);
                } else {
                    for (let j of Object.keys(res.locals.role[i])) {
                        allowedURLs.push(res.locals.role[i][j]);
                    }
                }
            }
        }
    }
    if (!allowedURLs.includes('/home')) {
        allowedURLs.push('/home');
    }
    res.locals.allowedURLs = allowedURLs;
    res.locals.validShifts = validShifts;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    next();
})

app.get('/', (req, res) => {
    res.send('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(PORT, host, () => {
    console.log(`Listening at ${host}:${PORT}`);
});