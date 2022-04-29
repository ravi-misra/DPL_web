const multer = require("multer");
const path = require("path");
const Dept = require("../models/department");
const Employee = require("../models/employee");
const Shift_sch = require("../models/shift_sch");
const Shift_cycle = require("../models/shift_cycle");
const ExpressError = require("../utils/ExpressErrors");
const {
    addMinutes,
    addDays,
    parse,
    differenceInCalendarDays,
    startOfDay,
} = require("date-fns");
const { validShifts } = require("../config");
const puppeteer = require("puppeteer");

const fileDestinationFolder = path.resolve(__dirname, "../uploads/shiftplans/");
const maxMB = 2;
let puppeteerCount = 0;
const maxPuppeteer = 2;

//multer setup
const options = {
    destination: fileDestinationFolder,
    filename: function (req, file, cb) {
        cb(null, req.body.costcode + ".htm");
    },
};
const storage = multer.diskStorage(options);

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /xls/;
    // Check ext
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = /application\/vnd\.ms-excel$/.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(
            new ExpressError(
                "Only system generated excel files are allowed",
                404
            )
        );
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: maxMB * 1000 * 1000 }, //Size in bytes
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
}).single("attendance-sheet");

async function handleShiftPlan(req, res, selection = "") {
    let hodDeps = await Dept.find({ hod: req.user._id });
    let hodObject = {};
    for (let d of hodDeps) {
        hodObject[d.costcode] = d.costcode + " - " + d.name;
    }
    return hodObject;
}

async function processExcelFile(req, res, fileUri) {
    let empRefMap = {};
    let shiftCycleRef,
        runningDate,
        firstIteration = true;
    fileUri = `file:///` + fileUri;
    puppeteerCount += 1;
    const browser = await puppeteer.launch({});
    try {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        await page.goto(fileUri);
        // await new Promise((resolve) => setTimeout(resolve, 3000));
        let allRows = await page.$$("#grdpunch > tbody > tr");
        for (let row of allRows.slice(1)) {
            let rowData = await row.$$eval("td", (tds) => {
                if (tds) {
                    return tds.map((x) => x.innerText);
                } else {
                    return undefined;
                }
            });

            let depCode = rowData[1].trim();
            let dateString = rowData[2].trim();
            let personalNumber = rowData[3].trim();
            let scheduledShift = rowData[6].trim();
            let modifiedShift = rowData[7].trim();
            let scheduledStatus = rowData[8].trim();
            if (
                depCode === req.body.costcode &&
                dateString &&
                personalNumber &&
                validShifts.includes(scheduledShift) &&
                scheduledStatus !== "WO"
            ) {
                let empDoc = await Employee.findOne({
                    username: personalNumber,
                }).populate({
                    path: "dept",
                });
                if (empDoc) {
                    //confirm whether employee belongs to selected dept
                    if (!empDoc.dept.costcode === req.body.costcode) {
                        continue;
                    }
                    if (!Object.keys(empRefMap).includes(personalNumber)) {
                        empRefMap[personalNumber] = empDoc._id;
                    }
                }
                if (empRefMap[personalNumber]) {
                    runningDate = addMinutes(
                        parse(dateString, "dd/MM/yyyy", new Date()),
                        330
                    );
                    if (firstIteration) {
                        shiftCycleRef = runningDate;
                        firstIteration = false;
                    }
                    let finalShift = scheduledShift;
                    if (validShifts.includes(modifiedShift)) {
                        finalShift = modifiedShift;
                    }
                    let filter = {
                        employee: empRefMap[personalNumber],
                        date: runningDate,
                    };
                    let update = {
                        shift: [finalShift],
                        sch_shift: scheduledShift,
                    };
                    let doc = await Shift_sch.findOneAndUpdate(filter, update, {
                        new: true,
                        upsert: true,
                    });
                    await doc.save();
                }
            }
        }
        if (differenceInCalendarDays(runningDate, shiftCycleRef) >= 20) {
            const cycleDep = await Dept.findOne({
                costcode: req.body.costcode,
            });
            const newCycle = await Shift_cycle.findOneAndUpdate(
                { dept: cycleDep._id },
                {
                    shift_cycle_ref: shiftCycleRef,
                    next_start_ref: addDays(runningDate, 1),
                },
                {
                    new: true,
                    upsert: true,
                }
            );
            await newCycle.save();
        }
    } catch (e) {
        console.log(e);
        throw e;
    } finally {
        await browser.close();
        puppeteerCount -= 1;
    }
}

module.exports.renderShiftPlanForm = async (req, res) => {
    let hodObject = await handleShiftPlan(req, res);
    res.render("admin/shiftplanning", { hodObject });
};

module.exports.uploadShiftPlan = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            next(err);
        } else {
            if (!req.body.costcode) {
                req.flash(
                    "error",
                    "Please select a department from dropdown menu."
                );
                res.redirect("/admin/shift-plan");
            } else if (req.file === undefined) {
                req.flash("error", "No file selected.");
                res.redirect("/admin/shift-plan");
            } else {
                if (puppeteerCount >= maxPuppeteer) {
                    req.flash("error", "Server busy try after some time.");
                    res.redirect("/admin/shift-plan");
                } else {
                    await processExcelFile(
                        req,
                        res,
                        path.resolve(
                            fileDestinationFolder,
                            req.body.costcode + ".htm"
                        )
                    );
                    req.flash("success", "Shift plan updated.");
                    res.redirect("/admin/shift-plan");
                }
            }
        }
    });
};
