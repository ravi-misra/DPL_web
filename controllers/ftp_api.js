const sql = require("mssql");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { format, isFuture, addDays } = require("date-fns");

const myData = {
    "total-stock-val": "total_stock",
    "total-stock-days-val": "total_stock_days",
    "deviation-txt": "deviation_txt",
    ftp1: {
        1: "max_bag_dpt",
        2: "min_bag_dpt",
        3: "running_filter_count",
        4: "inlet_temp",
        5: "avg_maxima_inlet",
        6: "outlet_press",
        7: "diff_press",
        8: "avg_maxima_pulse",
        9: "pulse_interval",
        10: "pulse_duration",
        11: "running_scs",
        12: "sc_min_freq",
        13: "sc_max_freq",
        14: "fresh_al_flow",
        15: "sec_silo",
        16: "hopper_bl",
        17: "sec_airlift_p",
        18: "sec_airslide_p",
        19: "vib_screen",
        20: "compressor_running",
        21: "compressor_running_hours",
        22: "running_mefs",
        23: "avg_mef_cur",
        24: "hf_avg",
        25: "hf_max",
        26: "hf_gt_2",
        27: "hf_gt_5",
        28: "hf_exceed",
        29: "avg_dust",
        30: "max_dust",
        B101: "drive_status_b101",
        B102: "drive_status_b102",
        B103: "drive_status_b103",
        B104: "drive_status_b104",
        B105: "drive_status_b105",
        B106: "drive_status_b106",
        F107: "drive_status_f107",
        F108: "drive_status_f108",
        F109: "drive_status_f109",
        F110: "drive_status_f110",
    },
    ftp2: {
        1: "max_bag_dpt",
        2: "min_bag_dpt",
        3: "running_filter_count",
        4: "inlet_temp",
        5: "avg_maxima_inlet",
        6: "outlet_press",
        7: "diff_press",
        8: "avg_maxima_pulse",
        9: "pulse_interval",
        10: "pulse_duration",
        11: "running_scs",
        12: "sc_min_freq",
        13: "sc_max_freq",
        14: "fresh_al_flow",
        15: "sec_silo",
        16: "hopper_bl",
        17: "sec_airlift_p",
        18: "sec_airslide_p",
        19: "vib_screen",
        20: "compressor_running",
        21: "compressor_running_hours",
        22: "running_mefs",
        23: "avg_mef_cur",
        24: "hf_avg",
        25: "hf_max",
        26: "hf_gt_2",
        27: "hf_gt_5",
        28: "hf_exceed",
        29: "avg_dust",
        30: "max_dust",
        B201: "drive_status_b201",
        B202: "drive_status_b202",
        B203: "drive_status_b203",
        B204: "drive_status_b204",
        B205: "drive_status_b205",
        B206: "drive_status_b206",
        F207: "drive_status_f207",
        F208: "drive_status_f208",
        F210: "drive_status_f210",
        F209: "drive_status_f209",
    },
    ftp3: {
        1: "max_bag_dpt",
        2: "min_bag_dpt",
        3: "running_filter_count",
        4: "inlet_temp",
        5: "avg_maxima_inlet",
        6: "outlet_press",
        7: "diff_press",
        8: "avg_maxima_pulse",
        9: "pulse_interval",
        10: "pulse_duration",
        11: "running_scs",
        12: "sc_min_freq",
        13: "sc_max_freq",
        14: "fresh_al_flow",
        15: "sec_silo",
        16: "hopper_bl",
        17: "sec_airlift_p",
        18: "sec_airslide_p",
        19: "vib_screen",
        20: "compressor_running",
        21: "compressor_running_hours",
        22: "running_mefs",
        23: "avg_mef_cur",
        24: "hf_avg",
        25: "hf_max",
        26: "hf_gt_2",
        27: "hf_gt_5",
        28: "hf_exceed",
        29: "avg_dust",
        30: "max_dust",
        B301: "drive_status_b301",
        B302: "drive_status_b302",
        B303: "drive_status_b303",
        B304: "drive_status_b304",
        B305: "drive_status_b305",
        B306: "drive_status_b306",
        F307: "drive_status_f307",
        F308: "drive_status_f308",
        F309: "drive_status_f309",
        F310: "drive_status_f310",
    },
    ftp4: {
        1: "max_bag_dpt",
        2: "min_bag_dpt",
        3: "running_filter_count",
        4: "inlet_temp",
        5: "avg_maxima_inlet",
        6: "outlet_press",
        7: "diff_press",
        8: "avg_maxima_pulse",
        9: "pulse_interval",
        10: "pulse_duration",
        11: "running_scs",
        12: "sc_min_freq",
        13: "sc_max_freq",
        14: "fresh_al_flow",
        15: "sec_silo",
        16: "hopper_bl",
        17: "sec_airlift_p",
        18: "sec_airslide_p",
        19: "vib_screen",
        20: "compressor_running",
        21: "compressor_running_hours",
        22: "running_mefs",
        23: "avg_mef_cur",
        24: "hf_avg",
        25: "hf_max",
        26: "hf_gt_2",
        27: "hf_gt_5",
        28: "hf_exceed",
        29: "avg_dust",
        30: "max_dust",
        B401: "drive_status_b401",
        B402: "drive_status_b402",
        B403: "drive_status_b403",
        B404: "drive_status_b404",
        B405: "drive_status_b405",
        B406: "drive_status_b406",
        F407: "drive_status_f407",
        F408: "drive_status_f408",
        F409: "drive_status_f409",
        F410: "drive_status_f410",
    },
    ftp5: {
        1: "max_bag_dpt",
        2: "min_bag_dpt",
        3: "running_filter_count",
        4: "inlet_temp",
        5: "avg_maxima_inlet",
        6: "outlet_press",
        7: "diff_press",
        8: "avg_maxima_pulse",
        9: "pulse_interval",
        10: "pulse_duration",
        11: "running_scs",
        12: "sc_min_freq",
        13: "sc_max_freq",
        15: "sec_silo",
        16: "hopper_bl",
        17: "sec_airlift_p",
        18: "sec_airslide_p",
        19: "vib_screen",
        20: "compressor_running",
        21: "compressor_running_hours",
        22: "running_mefs",
        23: "avg_mef_cur",
        24: "hf_avg",
        25: "hf_max",
        26: "hf_gt_2",
        27: "hf_gt_5",
        28: "hf_exceed",
        29: "avg_dust",
        30: "max_dust",
        B501: "drive_status_b501",
        B502: "drive_status_b502",
        B503: "drive_status_b503",
        B504: "drive_status_b504",
        B505: "drive_status_b505",
        B506: "drive_status_b506",
        F507: "drive_status_f507",
        F508: "drive_status_f508",
        F509: "drive_status_f509",
        F510: "drive_status_f510",
    },
    ftp6: {
        1: "max_bag_dpt",
        2: "min_bag_dpt",
        3: "running_filter_count",
        4: "inlet_temp",
        5: "avg_maxima_inlet",
        6: "outlet_press",
        7: "diff_press",
        8: "avg_maxima_pulse",
        9: "pulse_interval",
        10: "pulse_duration",
        11: "running_scs",
        12: "sc_min_freq",
        13: "sc_max_freq",
        15: "sec_silo",
        16: "hopper_bl",
        17: "sec_airlift_p",
        18: "sec_airslide_p",
        19: "vib_screen",
        20: "compressor_running",
        21: "compressor_running_hours",
        22: "running_mefs",
        23: "avg_mef_cur",
        24: "hf_avg",
        25: "hf_max",
        26: "hf_gt_2",
        27: "hf_gt_5",
        28: "hf_exceed",
        29: "avg_dust",
        30: "max_dust",
        B601: "drive_status_b601",
        B602: "drive_status_b602",
        B603: "drive_status_b603",
        B604: "drive_status_b604",
        B605: "drive_status_b605",
        B606: "drive_status_b606",
        F607: "drive_status_f607",
        F608: "drive_status_f608",
        F609: "drive_status_f609",
        F610: "drive_status_f610",
    },
    gtc7: {
        1: "max_bag_dpt",
        2: "min_bag_dpt",
        3: "running_filter_count",
        4: "inlet_temp",
        5: "avg_maxima_inlet",
        6: "outlet_press",
        7: "diff_press",
        8: "avg_maxima_pulse",
        9: "pulse_interval",
        10: "pulse_duration",
        11: "running_scs",
        12: "sc_min_freq",
        13: "sc_max_freq",
        14: "fresh_al_flow",
        15: "sec_silo",
        16: "hopper_bl",
        17: "sec_airlift_p",
        18: "sec_airslide_p",
        19: "vib_screen",
        20: "compressor_running",
        21: "compressor_running_hours",
        22: "running_mefs",
        23: "avg_mef_cur",
        24: "hf_avg",
        25: "hf_max",
        26: "hf_gt_2",
        27: "hf_gt_5",
        28: "hf_exceed",
        29: "avg_dust",
        30: "max_dust",
        B701: "drive_status_b701",
        B702: "drive_status_b702",
        B703: "drive_status_b703",
        B704: "drive_status_b704",
        F707: "drive_status_f707",
        F708: "drive_status_f708",
        F709: "drive_status_f709",
        F710: "drive_status_f710",
    },
    gtc8: {
        1: "max_bag_dpt",
        2: "min_bag_dpt",
        3: "running_filter_count",
        4: "inlet_temp",
        5: "avg_maxima_inlet",
        6: "outlet_press",
        7: "diff_press",
        8: "avg_maxima_pulse",
        9: "pulse_interval",
        10: "pulse_duration",
        11: "running_scs",
        12: "sc_min_freq",
        13: "sc_max_freq",
        14: "fresh_al_flow",
        15: "sec_silo",
        16: "hopper_bl",
        17: "sec_airlift_p",
        18: "sec_airslide_p",
        19: "vib_screen",
        20: "compressor_running",
        21: "compressor_running_hours",
        22: "running_mefs",
        23: "avg_mef_cur",
        24: "hf_avg",
        25: "hf_max",
        26: "hf_gt_2",
        27: "hf_gt_5",
        28: "hf_exceed",
        29: "avg_dust",
        30: "max_dust",
        B801: "drive_status_b801",
        B802: "drive_status_b802",
        B803: "drive_status_b803",
        B804: "drive_status_b804",
        F807: "drive_status_f807",
        F808: "drive_status_f808",
        F809: "drive_status_f809",
        F810: "drive_status_f810",
    },
    plc2: {
        1: "silo_level_JN101",
        2: "silo_level_JN102",
        3: "silo_level_JN103",
        4: "silo_level_JN104",
        5: "silo_level_JN201",
        6: "silo_level_JN202",
        7: "silo_level_JN203",
        8: "silo_level_JN204",
        9: "avg_level_silo1",
        10: "avg_level_silo1_qty",
        11: "avg_level_silo2",
        12: "avg_level_silo2_qty",
        av2: "drive_status_av2",
        av4: "drive_status_av4",
        av6: "drive_status_av6",
        as2: "drive_status_as2",
        as4: "drive_status_as4",
        as6: "drive_status_as6",
        an5: "drive_status_an5",
        an6: "drive_status_an6",
        an7: "drive_status_an7",
        an8: "drive_status_an8",
        "av23-R": "dedusting_av23",
        "av22-R": "dedusting_av22",
    },
    plc3: {
        1: "silo_level_JN301",
        2: "silo_level_JN302",
        3: "silo_level_JN303",
        4: "silo_level_JN304",
        5: "silo_level_JN401",
        6: "silo_level_JN402",
        7: "silo_level_JN403",
        8: "silo_level_JN404",
        9: "avg_level_silo3",
        10: "avg_level_silo3_qty",
        11: "avg_level_silo4",
        12: "avg_level_silo4_qty",
        av1: "drive_status_av1",
        av3: "drive_status_av3",
        av5: "drive_status_av5",
        as1: "drive_status_as1",
        as3: "drive_status_as3",
        as5: "drive_status_as5",
        an1: "drive_status_an1",
        an2: "drive_status_an2",
        an3: "drive_status_an3",
        an4: "drive_status_an4",
        "av21-R": "dedusting_av21",
        "av20-R": "dedusting_av20",
    },
    plc4: {
        1: "silo_level_LT501",
        2: "silo_level_LT502",
        3: "silo_level_LT503",
        4: "silo_level_LT504",
        5: "avg_level_silo5",
        6: "avg_level_silo5_qty",
        14: "fresh_al_flow",
        "BLR5-1": "drive_status_blr5.1",
        "BLR5-2": "drive_status_blr5.2",
        "BLT5-1": "drive_status_blt5.1",
        "BLT5-2": "drive_status_blt5.2",
        "BLB5-1": "drive_status_blb5.1",
        "BLB5-2": "drive_status_blb5.2",
        "BLA5-1": "drive_status_bla5.1",
        "BLA5-2": "drive_status_bla5.2",
        "BLF5-1": "drive_status_blf5.1",
        "BLF5-2": "drive_status_blf5.2",
        "du11-R": "dedusting_du11",
        "du41-R": "dedusting_du41",
    },
    plc5: {
        1: "silo_level_LT701",
        2: "silo_level_LT702",
        3: "silo_level_LT703",
        4: "silo_level_LT704",
        5: "avg_level_silo7",
        6: "avg_level_silo7_qty",
        14: "fresh_al_flow",
        "BLR7-1": "drive_status_blr7.1",
        "BLR7-2": "drive_status_blr7.2",
        "BLT7-1": "drive_status_blt7.1",
        "BLT7-2": "drive_status_blt7.2",
        "BLB7-1": "drive_status_blb7.1",
        "BLB7-2": "drive_status_blb7.2",
        "BLA7-1": "drive_status_bla7.1",
        "BLA7-2": "drive_status_bla7.2",
        "BLF7-1": "drive_status_blf7.1",
        "BLF7-2": "drive_status_blf7.2",
        "du29-R": "dedusting_du29",
        "du42-R": "dedusting_du42",
    },
    plc6: {
        2: "silo_level_LI6003",
        1: "silo_level_LI6002",
        3: "silo_level_LI6004",
        4: "silo_level_LI6005",
        5: "avg_level_silo6",
        6: "avg_level_silo6_qty",
        FN6109: "drive_status_fn6109",
        FN6110: "drive_status_fn6110",
        FN6113: "drive_status_fn6113",
        FN6114: "drive_status_fn6114",
        BL6103: "drive_status_bl6103",
        BL6104: "drive_status_bl6104",
        BL6107: "drive_status_bl6107",
        BL6108: "drive_status_bl6108",
        BL6115: "drive_status_bl6115",
        BL6116: "drive_status_bl6116",
        du261A: "dedusting_du261a",
        du261B: "dedusting_du261b",
        du291A: "dedusting_du291a",
        du291B: "dedusting_du291b",
    },
    plc7: {
        2: "silo_level_LI8003",
        1: "silo_level_LI8002",
        3: "silo_level_LI8004",
        4: "silo_level_LI8005",
        5: "avg_level_silo8",
        6: "avg_level_silo8_qty",
        FN8125: "drive_status_fn8125",
        FN8126: "drive_status_fn8126",
        FN8129: "drive_status_fn8129",
        FN8130: "drive_status_fn8130",
        BL8119: "drive_status_bl8119",
        BL8120: "drive_status_bl8120",
        BL8123: "drive_status_bl8123",
        BL8124: "drive_status_bl8124",
        BL8131: "drive_status_bl8131",
        BL8132: "drive_status_bl8132",
        du279A: "dedusting_du279a",
        du279B: "dedusting_du279b",
        du292A: "dedusting_du292a",
        du292B: "dedusting_du292b",
    },
    hdps7: {
        "av701-val": "pit_av701",
        "av702-val": "pit_av702",
        "av703-val": "pit_av703",
        "av704-val": "pit_av704",
        "pit710-val": "pit710",
        "pit711-val": "pit711",
        "pit720-val": "pit720",
        "pit721-val": "pit721",
        av751: "drive_status_av751",
        av752: "drive_status_av752",
    },
    hdps8: {
        "av801-val": "pit_av801",
        "av802-val": "pit_av802",
        "av803-val": "pit_av803",
        "av804-val": "pit_av804",
        "pit810-val": "pit810",
        "pit811-val": "pit811",
        "pit820-val": "pit820",
        "pit821-val": "pit821",
        av851: "drive_status_av851",
        av852: "drive_status_av852",
    },
};

const ftpFolder = path.resolve(__dirname, "../uploads/ftp/");

const dbConfig = {
    user: "smartsmelter",
    password: "Smelter@123",
    server: "10.130.82.111", // example: localhost
    database: "smartsmelter",
    options: {
        encrypt: false, // If using Azure SQL, else set to false
        trustServerCertificate: true, // True for local dev/test (self-signed certs)
    },
};

function dateshiftValidity(date, shift) {
    let now = new Date();
    let selectedDate = new Date(date);
    let returnValue = {};
    if (isFuture(selectedDate)) {
        returnValue = {
            action: "invalid-date",
            message: "The selected date is invalid.",
        };
    } else if (
        now.getFullYear() == selectedDate.getFullYear() &&
        now.getMonth() == selectedDate.getMonth() &&
        now.getDate() == selectedDate.getDate()
    ) {
        if (shift === "C") {
            returnValue = {
                action: "invalid-shift",
                message: "The selected shift is invalid.",
            };
        } else if (
            (now.getHours() < 21 || now.getMinutes() < 35) &&
            shift === "B"
        ) {
            returnValue = {
                action: "invalid-shift",
                message: "The selected shift is invalid.",
            };
        } else if (
            (now.getHours() < 13 || now.getMinutes() < 35) &&
            shift === "A"
        ) {
            returnValue = {
                action: "invalid-shift",
                message: "The selected shift is invalid.",
            };
        } else {
            returnValue = {
                action: "manual-entry",
                message:
                    "No matching data found, do you want to enter all the data manually?",
            };
        }
    } else if (
        now.getFullYear() == selectedDate.getFullYear() &&
        now.getMonth() == selectedDate.getMonth() &&
        now.getDate() == addDays(selectedDate, 1).getDate()
    ) {
        if ((now.getHours() < 5 || now.getMinutes() < 35) && shift === "C") {
            returnValue = {
                action: "invalid-shift",
                message: "The selected shift is invalid.",
            };
        } else {
            returnValue = {
                action: "manual-entry",
                message:
                    "No matching data found, do you want to enter all the data manually?",
            };
        }
    } else {
        returnValue = {
            action: "manual-entry",
            message:
                "No matching data found, do you want to enter all the data manually?",
        };
    }
    return returnValue;
}

module.exports.saveReport = async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const submittedData = req.body;
        let jsonData = {};
        let date = "",
            shift = "";
        if (
            Object.hasOwn(submittedData, "report-date") &&
            Object.hasOwn(submittedData, "report-shift") &&
            Object.hasOwn(submittedData, "form-action")
        ) {
            date = submittedData["report-date"];
            shift = submittedData["report-shift"];
            let validShift = dateshiftValidity(date, shift);
            if (!validShift["action"].includes("invalid")) {
                for (let k of Object.keys(submittedData)) {
                    let idArray = k.split("-");
                    let areaItem = idArray.slice(1).join("-");
                    // As Number("") == 0 in js, we have to filter out blank values from number fields
                    if (submittedData[k].length > 0) {
                        // top level aggregate values
                        if (Object.hasOwn(myData, k)) {
                            if (idArray.includes("val")) {
                                if (!isNaN(submittedData[k])) {
                                    jsonData[myData[k]] = Number(
                                        submittedData[k]
                                    );
                                }
                            } else jsonData[myData[k]] = submittedData[k];
                        } else if (
                            Object.hasOwn(myData, idArray[0]) &&
                            (Object.hasOwn(myData[idArray[0]], idArray[1]) ||
                                Object.hasOwn(myData[idArray[0]], areaItem))
                        ) {
                            let areaData = {};
                            if (
                                idArray.includes("val") &&
                                (idArray[1] == "19" || idArray[1] == "20")
                            ) {
                                if (submittedData[k] == "true") {
                                    areaData[
                                        myData[idArray[0]][idArray[1]]
                                    ] = true;
                                } else
                                    areaData[
                                        myData[idArray[0]][idArray[1]]
                                    ] = false;
                            } else if (
                                idArray.includes("val") &&
                                !isNaN(idArray[1]) &&
                                !isNaN(submittedData[k])
                            ) {
                                areaData[myData[idArray[0]][idArray[1]]] =
                                    Number(submittedData[k]);
                            } else if (
                                areaItem.includes("val") &&
                                !isNaN(submittedData[k])
                            ) {
                                areaData[myData[idArray[0]][areaItem]] = Number(
                                    submittedData[k]
                                );
                            } else if (
                                Object.hasOwn(myData[idArray[0]], areaItem) &&
                                (myData[idArray[0]][areaItem].includes(
                                    "drive_status"
                                ) ||
                                    myData[idArray[0]][areaItem].includes(
                                        "dedusting"
                                    ))
                            ) {
                                if (
                                    submittedData[k] === "true" ||
                                    submittedData[k] === "on"
                                ) {
                                    areaData[
                                        myData[idArray[0]][areaItem]
                                    ] = true;
                                } else {
                                    areaData[
                                        myData[idArray[0]][areaItem]
                                    ] = false;
                                }
                            }
                            if (
                                !Object.hasOwn(
                                    jsonData,
                                    idArray[0].toUpperCase()
                                )
                            ) {
                                jsonData[idArray[0].toUpperCase()] = {};
                            }
                            jsonData[idArray[0].toUpperCase()] = {
                                ...jsonData[idArray[0].toUpperCase()],
                                ...areaData,
                            };
                        }
                    }
                }
                // Set unselected checkbox value to false
                for (let k of Object.keys(myData)) {
                    let areaData2 = {};
                    if (typeof myData[k] === "object") {
                        for (let m of Object.keys(myData[k])) {
                            let fullId = k + "-" + m;
                            if (
                                !Object.hasOwn(submittedData, fullId) &&
                                (myData[k][m].includes("drive_status") ||
                                    myData[k][m].includes("dedusting"))
                            ) {
                                areaData2[myData[k][m]] = false;
                                if (!Object.hasOwn(jsonData, k.toUpperCase())) {
                                    jsonData[k.toUpperCase()] = {};
                                }
                                jsonData[k.toUpperCase()] = {
                                    ...jsonData[k.toUpperCase()],
                                    ...areaData2,
                                };
                            }
                        }
                    }
                }
                /////////////////////////////////////////////////
            }
        }
        if (Object.keys(jsonData).length > 0 && date != "" && shift != "") {
            const jsonDataString = JSON.stringify(jsonData);
            await sql.connect(dbConfig);
            const result =
                await sql.query`SELECT * FROM ftp_report WHERE shift_date = ${date} AND shift = ${shift}`;
            if (result.recordset.length > 0) {
                const report = result.recordset[0];
                if (report.status === "draft") {
                    if (submittedData["form-action"] === "final") {
                        await sql.query`UPDATE ftp_report
                                SET data = ${jsonDataString}, status = 'final'
                                WHERE shift = ${shift} AND shift_date = ${date}`;
                    } else {
                        await sql.query`UPDATE ftp_report
                                SET data = ${jsonDataString}, status = 'draft'
                                WHERE shift = ${shift} AND shift_date = ${date}`;
                    }
                }
            } else {
                if (report.status === "draft") {
                    if (submittedData["form-action"] === "final") {
                        await sql.query`INSERT INTO ftp-report (shift_date, shift, data, status)
                        VALUES (${date}, ${shift}, ${jsonDataString}, 'final')`;
                    } else {
                        await sql.query`INSERT INTO ftp-report (shift_date, shift, data, status)
                        VALUES (${date}, ${shift}, ${jsonDataString}, 'draft')`;
                    }
                }
            }
        }
        res.end();
    } catch (err) {
        console.error("Database query failed:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.serveBlankForm = async (req, res) => {
    const { date, shift } = req.body;
    let dateFormat = format(new Date(date), "do MMM yyyy");
    dateFormat = dateFormat.split(" ");
    const dateString =
        dateFormat[0] + " " + dateFormat[1] + `'` + dateFormat[2];
    res.render("dashboards/ftp_entry_form.ejs", { date, shift, dateString });
};

module.exports.uploadPdfReport = async (req, res) => {
    const { date, shift } = req.body;
    let dateFormat = format(new Date(date), "do MMM yyyy");
    dateFormat = dateFormat.split(" ");
    const dateString =
        dateFormat[0] + " " + dateFormat[1] + `'` + dateFormat[2];
    try {
        // Connect to the database
        await sql.connect(dbConfig);
        const result =
            await sql.query`SELECT * FROM ftp_report WHERE shift_date = ${date} AND shift = ${shift}`;

        if (result.recordset.length > 0) {
            const report = result.recordset[0];
            let jsonData = JSON.parse(report.data);
            let updatedHTML = "";
            if (report.status === "draft") {
                // Send the PDF file if status is 'final'
                // const pdfFilePath = path.join(ftpFolder, "withdrawal.pdf");
                // res.download(pdfFilePath);
                // fs.readFile(pdfFilePath, (err, data) => {
                //     if (err) {
                //         console.error(err);
                //         return;
                //     }
                //     // Set headers and send the PDF
                //     res.set({
                //         "Content-Type": "application/pdf",
                //         "Content-Disposition":
                //             'attachment; filename="report.pdf"',
                //     });
                //     res.send(data);
                // });
                // res.render(
                //     "dashboards/ftp_entry_form.ejs",
                //     { mykey: "hello" },
                //     (err, html) => {
                //         if (err) {
                //             console.log(err);
                //         }
                //         populateHTMLFromDB(html, jsonData, myData)
                //             .then((finalHTML) => {
                //                 res.set({ "Content-Type": "text/html" });
                //                 res.send(html);
                //             })
                //             .catch((error) =>
                //                 console.error("Error during execution:", error)
                //             );
                //     }
                // );
                res.render(
                    "dashboards/ftp_entry_form.ejs",
                    { date, shift, dateString },
                    (err, html) => {
                        if (err) {
                            console.log(err);
                        }
                        updatedHTML = html;
                    }
                );
                updatedHTML = await populateHTMLFromDB(
                    updatedHTML,
                    jsonData,
                    myData,
                    dateString,
                    shift,
                    false
                );
                res.set({ "Content-Type": "text/html" });
                res.send(updatedHTML);
            } else {
                updatedHTML = fs.readFileSync(
                    path.join(
                        __dirname,
                        "..",
                        "views",
                        "dashboards",
                        "ftp_report_pdf.html"
                    ),
                    "utf8"
                );
                const pdfBuffer = await populateHTMLFromDB(
                    updatedHTML,
                    jsonData,
                    myData,
                    dateString,
                    shift,
                    true
                );

                res.set({
                    "Content-Type": "application/pdf",
                    "Content-Disposition": 'attachment; filename="report.pdf"',
                    "Content-Length": pdfBuffer.length,
                });
                res.end(pdfBuffer);
            }
        } else {
            // No matching row found
            res.json(dateshiftValidity(date, shift));
        }
    } catch (err) {
        console.error("Database query failed:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

async function populateHTMLFromDB(
    html,
    jsonData,
    myData,
    reportDate,
    reportShift,
    pdf
) {
    const browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        // --no-sandbox : Disables the Chromium sandbox entirely
        // --disable-setuid-sandbox : Disables a specific type of sandboxing called setuid sandbox, which relies on special permissions on Linux to isolate processes.
    });
    const page = await browser.newPage();
    // Load your HTML content directly
    await page.setContent(html, { waitUntil: "networkidle0" });
    const finalHTML = await page.evaluate(
        ({ jsonData, myData, reportDate, reportShift, pdf }) => {
            // Iterate through the keys of the "myData" template
            if (pdf) {
                document.getElementById("shift-date").innerHTML = reportDate;
                document.getElementById("shift").innerHTML = reportShift;
            }
            for (let k of Object.keys(myData)) {
                let topEntry = myData[k];
                // Check if top entry value is a value or object
                if (typeof topEntry === "string") {
                    if (Object.hasOwn(jsonData, topEntry)) {
                        let element = document.getElementById(k);
                        if (element) {
                            if (
                                element.tagName.toLowerCase() === "input" &&
                                element.type === "number"
                            ) {
                                element.setAttribute(
                                    "value",
                                    jsonData[topEntry]
                                );
                            } else if (
                                element.tagName.toLowerCase() === "textarea"
                            ) {
                                element.innerHTML = jsonData[topEntry];
                            }
                        }
                    }
                } else if (typeof topEntry === "object" && topEntry !== null) {
                    const area = k.toUpperCase();
                    for (let p of Object.keys(topEntry)) {
                        if (Object.hasOwn(jsonData[area], topEntry[p])) {
                            let myID = !isNaN(p)
                                ? `${k}-${p}-val`
                                : `${k}-${p}`;
                            let element = document.getElementById(myID);
                            if (
                                element &&
                                element.tagName.toLowerCase() === "input"
                            ) {
                                if (element.type === "number") {
                                    let testValue = jsonData[area][topEntry[p]];
                                    element.setAttribute("value", testValue);
                                    ///////////////////////////////////////////////
                                    //Change background depending on cut-off values
                                    ///////////////////////////////////////////////
                                    if (/ftp\d-(1|2)-val/.test(myID)) {
                                        //Bag filter DP
                                        if (
                                            testValue < 100 ||
                                            testValue > 250
                                        ) {
                                            element.classList.add(
                                                "monitored-value"
                                            );
                                        }
                                    } else if (/ftp\d-7-val/.test(myID)) {
                                        //Plant DP
                                        if (testValue > 300) {
                                            element.classList.add(
                                                "monitored-value"
                                            );
                                        }
                                    } else if (/ftp\d-(24|25)-val/.test(myID)) {
                                        //HF
                                        if (testValue > 5) {
                                            element.classList.add(
                                                "monitored-value"
                                            );
                                        }
                                    } else if (/ftp\d-(29|30)-val/.test(myID)) {
                                        //Dust
                                        if (testValue > 50) {
                                            element.classList.add(
                                                "monitored-value"
                                            );
                                        }
                                    }
                                } else if (element.type === "radio") {
                                    if (jsonData[area][topEntry[p]]) {
                                        element.setAttribute("checked", true);
                                    } else {
                                        let tempId = myID.split("-");
                                        if (tempId.pop() === "R") {
                                            tempId.push("NR");
                                        }
                                        myID = tempId.join("-");
                                        let radioElement =
                                            document.getElementById(myID);
                                        if (radioElement) {
                                            radioElement.setAttribute(
                                                "checked",
                                                true
                                            );
                                        }
                                    }
                                } else if (element.type === "checkbox") {
                                    if (jsonData[area][topEntry[p]]) {
                                        element.setAttribute("checked", true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return document.documentElement.outerHTML;
        },
        { jsonData, myData, reportDate, reportShift, pdf }
    );
    if (pdf) {
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });
        await browser.close();
        return pdfBuffer;
    } else {
        await browser.close();
        return finalHTML;
    }
}
