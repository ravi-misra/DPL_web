const multer = require("multer");
const path = require("path");
const Dept = require("../models/department");
const { addMinutes, addDays} = require("date-fns");
const xlsx = require("xlsx");

//multer setup
const options = {
    destination: "../uploads/shiftplans",
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
        cb("Only excel files are allowed");
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
        hodObject[d.costcode] = d.name;
    }
}


async function processExcelFile(req, res, filename) {
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
        let firstDate = new Date(z.getFullYear(), z.getDate() - 1, z.getMonth() + 1);
        firstDate = addMinutes(newDate, 330);
        let currentDateValue = firstDateValue, currentDate = firstDate;
        for (let d of data) {
            if (d["Dept Cd"] && d["Attend Dt"] && d["PersNo"] && d["Sch. Sts."]) {
                if (d["Sch. Sts."] !== "WO" && d["Dept Cd"] === req.body.costcode) {
                    if (d["PersNo"].length === 4) {
                        d["PersNo"] = "0" + d["PersNo"];
                    }
                    let runningDateValue = parseInt(d["Attend Dt"]);
                    if (currentDateValue === runningDateValue) {

                    } else {
                        currentDate = addDays(currentDate, 1);
                        currentDateValue = runningDateValue;
                    }
                }
            }
        }
    }

    // let x = addDays(new Date("1899-12-31"), parseInt(data[0]["Attend Dt"]));
    // y = x.toISOString();
    // y = y.slice(0, 10);
    // console.log(y);
    // z = new Date(y);
    // console.log(z);
    // console.log(z.getDate());
    // console.log(z.getMonth());
    // console.log(z.getFullYear());
    // let newDate = new Date(z.getFullYear(), z.getDate() - 1, z.getMonth() + 1);
    // console.log(addMinutes(newDate, 330));
}

module.exports.renderShiftPlanForm = async (req, res) => {};
