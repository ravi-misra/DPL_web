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
const {PORT, LOCAL_HOST, PLCI_HOST, DB_URL, validShifts} = require('./config');
const mainRoutes = require('./routes/main');
const profileRoutes = require('./routes/profile');
const dashboardRoutes = require('./routes/dashboard');
const {socketCarbonAreaRS1, socketCarbonAreaRS1Disconnect} = require("./sockets/carbon-area");
const Employee = require('./models/employee');
const {scrape, dbUpdate, deleteolddata} = require('./web-scraping/getPotlineEmployees');
const shutdownResponse = require('./utils/shutdownResponse');
const http = require('http');
const { Server } = require("socket.io");

// const host = PLCI_HOST;
const host = LOCAL_HOST;
// const validShifts = ['A', 'B', 'C', 'G', 'WO/LV', 'M', 'N'];

//express middlewares
const app = express();
const server = http.createServer(app);

const io = new Server(server);

//Add handlers for department wise data producer namespaces//////////

//Carbon area rs-1
let caRS1 = true;
io.of("ca-rs1").on("connection", (socket) => {
    if (caRS1) {
        console.log(`CA RS1 connected (id:${socket.id})`);
        socketCarbonAreaRS1(io, socket);
        caRS1 = false;
        socket.on("disconnect", (reason) => {
            console.log(`CA RS1 disconnected (id:${socket.id})`);
            caRS1 = true;
            socketCarbonAreaRS1Disconnect(io);
        });
    } else {
        socket.emit('reject');
        socket.disconnect(true);
        console.log(`CA RS1 client rejected (id:${socket.id})`);
    }
});

//Carbon area rs-2
let caRS2 = true;
io.of("ca-rs2").on("connection", (socket) => {
    if (caRS2) {
        console.log(`CA RS2 connected (id:${socket.id})`)
        socketCarbonAreaRS2(io, socket);
        caRS2 = false;
        socket.on("disconnect", (reason) => {
            console.log(`CA RS2 disconnected (id:${socket.id})`)
            caRS2 = true;
            socketCarbonAreaRS2Disconnect(io);
        });
    }
});


///////////////////////////////////////////////////////
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

passport.use(new LocalStrategy(Employee.authenticate()));
passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());

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
    } else {
        res.locals.role = undefined;
    }
    if (!allowedURLs.includes('/home')) {
        allowedURLs.push('/home');
    }
    res.locals.allowedURLs = allowedURLs;
    res.locals.validShifts = validShifts;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    if (!req.user && req.session.cookie.maxAge) {
        req.session.cookie.maxAge = 0;
    }
    next();
})

let useP = true;
// setInterval(useProfile, 10000);
// function useProfile() {
//     if(useP) {
//         useP=false;
//     } else {
//         useP = true;
//     }
// }

app.all('*', (req, res, next) => {
    if (useP) {
        next();
    } else {
        return res.send(shutdownResponse)
    }
})

app.use('/', mainRoutes);
app.use('/profile', profileRoutes);
app.use('/dashboard', dashboardRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    // res.status(statusCode).render('error', { err })
    req.flash('error', err.message);
    res.redirect('/home');
})

server.listen(PORT, host, () => {
    console.log(`Listening at ${host}:${PORT}`);
});