const multer = require("multer");
const path = require("path");
const Dept = require("../models/department");
const Employee = require("../models/employee");
const Shift_sch = require("../models/shift_sch");
const ExpressError = require("../utils/ExpressErrors");
const { addMinutes, addDays } = require("date-fns");
const xlsx = require("xlsx");
const { validShifts } = require("../config");
const puppeteer = require("puppeteer");

const fileDestinationFolder = path.resolve(__dirname, "../uploads/shiftplans/");

//multer setup
const options = {
    destination: fileDestinationFolder,
    filename: function (req, file, cb) {
        cb(null, req.body.costcode + path.extname(file.originalname));
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
    // // Check mime
    // const mimetype = filetypes.test(file.mimetype);

    if (extname) {
        return cb(null, true);
    } else {
        cb(new ExpressError("Only excel files are allowed", 404));
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1000 * 1000 }, //Size in bytes
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

async function processExcelFile2(req, res, fileUri) {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(fileUri);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    let allRows = await page.$$("#grdpunch > tbody > tr");
    for (let row of allRows.slice(1)) {
        let rowData = await row.$$eval("td", (tds) => {
            if (tds) {
                return tds.map((x) => x.innerText);
            } else {
                return undefined;
            }
        });

        if (!Object.keys(empRefMap).includes(d["PersNo"])) {
            let doc = await Employee.findOne({
                username: d["PersNo"],
            });
            if (doc) {
                empRefMap[d["PersNo"]] = doc._id;
            }
        }
    }
}

async function processExcelFile(req, res, filename) {
    let empRefMap = {};
    let wb = xlsx.readFile(filename);

    let ws = wb.Sheets[wb.SheetNames[0]];
    let data = xlsx.utils.sheet_to_json(ws);
    //Handle wrong date format supplied by system excel file
    let firstDateValue = parseInt(data[0]["Attend Dt"]);
    let x = addDays(new Date("1899-12-31"), firstDateValue);
    let y = x.toISOString();
    y = y.slice(0, 10);
    let z = new Date(y);
    if (z.getMonth() === 0) {
        let firstDate = new Date(
            z.getFullYear(),
            z.getDate() - 1,
            z.getMonth() + 1
        );
        firstDate = addMinutes(firstDate, 330);
        let currentDateValue = firstDateValue,
            currentDate = firstDate;
        for (let d of data) {
            if (
                d["Dept Cd"] &&
                d["Attend Dt"] &&
                d["PersNo"] &&
                d["Sch. Shift"] &&
                d["Sch. Sts."]
            ) {
                if (
                    d["Sch. Sts."] !== "WO" &&
                    d["Dept Cd"] === req.body.costcode &&
                    validShifts.includes(d["Sch. Shift"])
                ) {
                    if (d["PersNo"].length === 4) {
                        d["PersNo"] = "0" + d["PersNo"];
                    }
                    if (d["Dept Cd"].length === 2) {
                        d["Dept Cd"] = "0" + d["Dept Cd"];
                    }
                    let runningDateValue = parseInt(d["Attend Dt"]);
                    if (!Object.keys(empRefMap).includes(d["PersNo"])) {
                        let doc = await Employee.findOne({
                            username: d["PersNo"],
                        });
                        if (doc) {
                            empRefMap[d["PersNo"]] = doc._id;
                        }
                    }
                    if (empRefMap[d["PersNo"]]) {
                        if (currentDateValue === runningDateValue) {
                            //Same date record
                            let filter = {
                                employee: empRefMap[d["PersNo"]],
                                date: currentDate,
                            };
                            let update = {
                                $addToSet: { shift: d["Sch. Shift"] },
                            };
                            let doc = await Shift_sch.findOneAndUpdate(
                                filter,
                                update,
                                {
                                    new: true,
                                    upsert: true,
                                }
                            );
                            await doc.save();
                        } else {
                            //Next date record
                            currentDate = addDays(currentDate, 1);
                            currentDateValue = runningDateValue;
                            let filter = {
                                employee: empRefMap[d["PersNo"]],
                                date: currentDate,
                            };
                            let update = {
                                $addToSet: { shift: d["Sch. Shift"] },
                            };
                            let doc = await Shift_sch.findOneAndUpdate(
                                filter,
                                update,
                                {
                                    new: true,
                                    upsert: true,
                                }
                            );
                            await doc.save();
                        }
                    }
                }
            }
        }
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
            if (req.file === undefined) {
                next(new ExpressError("No file selected", 404));
            } else {
                await processExcelFile(
                    req,
                    res,
                    path.resolve(
                        fileDestinationFolder,
                        req.body.costcode + ".xls"
                    )
                );
                req.flash("success", "Shift plan updated.");
                res.redirect("/admin/shift-plan");
            }
        }
    });
};
