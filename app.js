const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {PORT, LOCAL_HOST, PLCI_HOST, DB_URL} = require('./config');

// const host = PLCI_HOST;
const host = LOCAL_HOST;

const app = express();

dbConnect().catch(err => console.log(err));
async function dbConnect() {
    await mongoose.connect(DB_URL);
    console.log('Database connected.');
}

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const store = MongoStore.create({ 
    clientPromise: mongoose.connection.asPromise().then(() => mongoose.connection.getClient()),
    touchAfter: 24*3600 // time period in seconds
});

const sessionConfig = {
    store,
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000*60*60*24*7, // time period in miliseconds
    }
}

app.use(session(sessionConfig));
// app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(flash());


app.get('/', (req, res) => {
    // if(req.session.count) {
    //     req.session.count += 1;
    // } else {
    //     req.session.count = 1;
    // }
    // res.send(`You have viewed ${req.session.count} times.`);
    res.render('users/shift-schedule-form.ejs'); 
})

app.listen(PORT, host, () => {
    console.log(`Listening at ${host}:${PORT}`);
});