const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressErrors");
const roles = require("./utils/role");
const populateDashboards = require("./utils/populateDashboards");
const {
    PORT,
    LOCAL_HOST,
    PLCI_HOST,
    DB_URL,
    validShifts,
} = require("./config");
const mainRoutes = require("./routes/main");
const profileRoutes = require("./routes/profile");
const dashboardRoutes = require("./routes/dashboard");
const adminRoutes = require("./routes/admin");
const apiRoutes = require("./routes/api");
const socListeners = require("./sockets/listeners");
const Employee = require("./models/employee");
const {
    scrape,
    dbUpdate,
    deleteolddata,
    repeatCycle,
} = require("./web-scraping/getPotlineEmployees");
const shutdownResponse = require("./utils/shutdownResponse");
// const http = require("http");
// const { Server } = require("socket.io");

// const host = PLCI_HOST;
const host = LOCAL_HOST;

const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

/////////////////////////////////////////////////////////////////////
//Add listeners for department wise data producer namespaces/////////
/////////////////////////////////////////////////////////////////////
//Carbon area rs-1
// socListeners.CARS1.cars1listener(io);

//Carbon area rs-2
// socListeners.CARS2.cars2listener(io);
/////////////////////////////////////////////////////////////////////

//MongoDB connection
dbConnect().catch((err) => console.log(err));
async function dbConnect() {
    await mongoose.connect(DB_URL);
    console.log("Database connected.");
}

//express middlewares

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

//View and templating engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Trust proxy
app.set("trust proxy", true);

//session configuration
const store = MongoStore.create({
    clientPromise: mongoose.connection.asPromise().then((c) => c.getClient()),
    // mongoUrl: DB_URL,
    touchAfter: 24 * 3600, // time period in seconds
});

const sessionConfig = {
    store,
    secret: "thisisnotagoodsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // maxAge: 1000*60*60*24*7, // time period in miliseconds
    },
};

app.use(session(sessionConfig));
app.use(flash());

//passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Employee.authenticate()));
passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());

app.use(async (req, res, next) => {
    let allowedURLs = [];
    res.locals.currentUser = req.user;
    if (req.user && req.user.role) {
        res.locals.role = roles[req.user.role];
        //dashboard logic
        let finalDashboard = await populateDashboards(res.locals.currentUser);
        if (finalDashboard) {
            res.locals.role["Dashboard"] = finalDashboard;
        } else if (res.locals.role["Dashboard"]) {
            delete res.locals.role["Dashboard"];
        }
        if (res.locals.role) {
            for (let i of Object.keys(res.locals.role)) {
                if (typeof res.locals.role[i] === "string") {
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
    res.locals.allowedURLs = allowedURLs;
    res.locals.validShifts = validShifts;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    if (!req.user && req.session.cookie.maxAge) {
        req.session.cookie.maxAge = 0;
    }
    next();
});

//Scheduled employees DB update
// let startDBUpdate = false;
// let dbUpdateHour = 2;
// let checkIntervalMinutes = 30;
// setInterval(triggerDBMaintenance, 1000 * 60 * checkIntervalMinutes);

// function triggerDBMaintenance() {
//     let myDate = new Date();
//     if (myDate.getHours() == dbUpdateHour) {
//         if (myDate.getMinutes() <= checkIntervalMinutes - 1) {
//             dbMaintenance();
//         }
//     }
// }

// async function dbMaintenance() {
//     try {
//         console.log(`Scraping started at ${new Date()}`);
//         const { data, allPN } = await scrape();
//         console.log("scraping done");
//         startDBUpdate = true;
//         await dbUpdate(data, allPN);
//         console.log("Update done");
//         await repeatCycle();
//         await deleteolddata();
//         console.log("Cleaning done");
//         console.log(`Completed at ${new Date()}`);
//     } catch (err) {
//         console.log(err);
//     } finally {
//         startDBUpdate = false;
//     }
// }

// app.all("*", (req, res, next) => {
//     if (!startDBUpdate) {
//         next();
//     } else {
//         return res.send(shutdownResponse);
//     }
// });

app.use("/", mainRoutes);
app.use("/profile", profileRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    // console.log(err);
    console.log("Error from following client ip");
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log(ip);
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong!";
    // res.status(statusCode).render("error", { err });
    // check if flash exists
    if (req.flash) {
        req.flash("error", err.message);
        res.redirect("/home");
    } else {
        res.end();
    }
});

app.listen(PORT, host, () => {
    console.log(`###################################`);
    console.log(`Web server started at ${new Date()}`);
    console.log(`Listening at ${host}:${PORT}`);
});
