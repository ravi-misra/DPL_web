const puppeteer = require("puppeteer");
const Dept = require("../models/department");
const Employee = require("../models/employee");
const Shift_sch = require("../models/shift_sch");
const Shift_cycle = require("../models/shift_cycle");
const {
    startOfDay,
    addDays,
    differenceInCalendarDays,
    addMinutes,
} = require("date-fns");
const { defaultHash, defaultSalt } = require("../utils/defaultPassword");
const { getExceptionUsers } = require("../utils/exceptionUsers");
const { pl_dept } = require("../config");
// let pl_dept = ["530-E & I - POTLINE"];

async function scrape() {
    let data = [];
    let allPN = [];
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(
        "http://10.60.235.33/ComplaintSys/TelephoneDirectory.aspx?unitcd=1400"
    );
    await new Promise((resolve) => setTimeout(resolve, 3000));
    for (let i of pl_dept) {
        await page.click("#ddlDept > span > button"); //open department list dropdown
        await new Promise((resolve) => setTimeout(resolve, 3000));
        let clickedData = await page.$$("#ddlDept_DropDown > div > ul > li"); //get all lis
        await new Promise((resolve) => setTimeout(resolve, 3000));
        for (let j of clickedData) {
            let deptText = await page.evaluate((x) => x.textContent, j);
            if (deptText.trim() === i) {
                await new Promise((resolve) => setTimeout(resolve, 3000)); //hovered class takes some time
                await j.hover();
                await new Promise((resolve) => setTimeout(resolve, 5000)); //hovered class takes some time
                await j.click();
                break;
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 10000)); //delay for page data update

        let bodyHandle = await page.$(
            "#TelGrid_ctl00 > tfoot > tr > td > div > div.rgWrap.rgInfoPart > strong:nth-child(2)"
        );
        let pageCount = 1;
        if (bodyHandle) {
            pageCount = await page.evaluate(
                (body) => body.textContent,
                bodyHandle
            );
            await bodyHandle.dispose();
        }
        pageCount = Number(pageCount);

        for (let j = 1; j <= pageCount; j++) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const dataRows = await page.$$("#TelGrid_ctl00 > tbody > tr");
            for (let row of dataRows) {
                const clickedData = await row.$$eval("td", (tds) => {
                    if (tds) {
                        return tds.map((x) => x.textContent);
                    } else {
                        return undefined;
                    }
                });
                if (clickedData.length > 0) {
                    let o = {};
                    o.dept_code = clickedData[4].trim().slice(0, 3);
                    o.pn = clickedData[3].trim().slice(0, 5);
                    o.name = clickedData[5].trim();
                    o.designation = clickedData[6].trim();
                    o.mobile = clickedData[14].trim();
                    o.gender = "M";
                    if (o.pn.length === 5 && !allPN.includes(o.pn)) {
                        data.push(o);
                        allPN.push(o.pn);
                    }
                }
            }
            if (j < pageCount) {
                let buttonNext = await page.evaluateHandle(() =>
                    document.querySelector(
                        "#TelGrid_ctl00 > tfoot > tr > td > div > div.rgWrap.rgArrPart2 > button.t-button.rgActionButton.rgPageNext"
                    )
                );
                await buttonNext.click();
                await new Promise((resolve) => setTimeout(resolve, 3000));
                await buttonNext.dispose();
            }
        }
        if (pageCount > 1) {
            let buttonFirst = await page.evaluateHandle(() =>
                document.querySelector(
                    "#TelGrid_ctl00 > tfoot > tr > td > div > div.rgWrap.rgArrPart1 > button.t-button.rgActionButton.rgPageFirst"
                )
            );
            await buttonFirst.click();
            await new Promise((resolve) => setTimeout(resolve, 3000));
            await buttonFirst.dispose();
        }
    }
    await browser.close();
    return { data, allPN };
}

async function dbUpdate(data = [], allPN = []) {
    let availablePN = [];
    let newPN = [];
    let newEmployees = [];
    let deptIDMap = {};
    for (let p of pl_dept) {
        let dep = await Dept.findOne({ costcode: p.slice(0, 3) });
        deptIDMap[p.slice(0, 3)] = dep._id;
    }
    if (data) {
        let docs = await Employee.find({});
        //Remove employees no longer in PL
        if (docs) {
            for (let doc of docs) {
                availablePN.push(doc.username);
            }
            let invalidPN = availablePN.filter((x) => !allPN.includes(x));
            if (invalidPN.length) {
                for (let pn of invalidPN) {
                    //dont delete usernames defined in exceptioUsers
                    let exceptionUsers = await getExceptionUsers();
                    if (!Object.keys(exceptionUsers).includes(pn)) {
                        await Employee.findOneAndDelete({ username: pn });
                    }
                }
            }
        }
        newPN = allPN.filter((x) => !availablePN.includes(x));
        //Update employee details from intranet
        for (let o of data) {
            if (deptIDMap[o.dept_code]) {
                if (newPN.includes(o.pn)) {
                    newEmployees.push({
                        username: o.pn,
                        name: o.name,
                        dept: deptIDMap[o.dept_code],
                        designation: o.designation,
                        mobile: o.mobile,
                        hash: defaultHash,
                        salt: defaultSalt,
                    });
                } else {
                    let doc = await Employee.findOneAndUpdate(
                        { username: o.pn },
                        {
                            name: o.name,
                            dept: deptIDMap[o.dept_code],
                            designation: o.designation,
                            mobile: o.mobile,
                        },
                        { new: true }
                    );
                    await doc.save();
                }
            }
        }
        if (newEmployees.length) {
            await Employee.create(newEmployees);
        }
    }
}

async function deleteolddata() {
    //delete old i/c attendance data
    const today = startOfDay(new Date());
    //delete data older than 30 days
    await Shift_sch.deleteMany({ date: { $lt: addDays(today, -30) } });
}

async function repeatCycle() {
    const today = addMinutes(startOfDay(new Date()), 330);
    const target_cycle_ref = addDays(today, -1);
    const targetCycles = await Shift_cycle.find({
        shift_cycle_ref: { $lte: target_cycle_ref },
    });
    //only one cycle per department
    for (let t of targetCycles) {
        let shiftCycleRef = t.shift_cycle_ref;
        let nextStartRef = t.next_start_ref;
        if (differenceInCalendarDays(nextStartRef, shiftCycleRef) === 21) {
            while (differenceInCalendarDays(today, shiftCycleRef) > 0) {
                for (let i = 0; i < 21; i++) {
                    copyDate = addDays(shiftCycleRef, i);
                    pasteDate = addDays(nextStartRef, i);
                    let copySch = await Shift_sch.find({
                        date: copyDate,
                    }).populate({
                        path: "employee",
                    });
                    for (let j of copySch) {
                        if (String(j.employee.dept) === String(t.dept)) {
                            let filter = {
                                employee: j.employee._id,
                                date: pasteDate,
                            };
                            let update = {
                                $setOnInsert: { shift: [j.sch_shift] }, //change main shift only if not already set
                                sch_shift: j.sch_shift,
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
                shiftCycleRef = addDays(copyDate, 1);
                nextStartRef = addDays(pasteDate, 1);
            }
            let updateCycle = await Shift_cycle.findOneAndUpdate(
                { dept: t.dept },
                {
                    shift_cycle_ref: shiftCycleRef,
                    next_start_ref: nextStartRef,
                },
                {
                    new: true,
                }
            );
            await updateCycle.save();
        }
        console.log("Shift cycles updated");
    }
}

module.exports = { scrape, dbUpdate, deleteolddata, repeatCycle };
