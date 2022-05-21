const Gap2AnodeData = require("../models/gap2AnodeData");
const Gap1AnodeData = require("../models/gap1AnodeData");
const { addMinutes } = require("date-fns");
const multer = require("multer");
const path = require("path");

const fileDestinationFolder = path.resolve(
    __dirname,
    "../uploads/pot_process/"
);
const maxMB = 100;

//multer setup
const options = {
    destination: fileDestinationFolder,
    filename: function (req, file, cb) {
        cb(null, "pot_process.db");
    },
};
const storage = multer.diskStorage(options);

const upload = multer({
    storage: storage,
    limits: { fileSize: maxMB * 1000 * 1000 }, //Size in bytes
}).single("potline-process-data");

module.exports.uploadPotData = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            next(err);
        } else if (req.file === undefined) {
            res.status(404).send("no file");
        } else {
            res.status(200).send("ok");
        }
    });
};

module.exports.saveGap2AnodeData = async (req, res) => {
    if (req.body.length) {
        for (let obj of req.body) {
            obj["DateAndTime"] = addMinutes(new Date(obj["DateAndTime"]), 330);
            let filter = {
                DateAndTime: obj["DateAndTime"],
            };
            let update = obj;
            let doc = await Gap2AnodeData.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true,
            });
            await doc.save();
        }
    }
    res.status(200).send("ok");
};

module.exports.saveGap1AnodeData = async (req, res) => {
    if (req.body.length) {
        for (let obj of req.body) {
            obj["DateAndTime"] = addMinutes(new Date(obj["DateAndTime"]), 330);
            let filter = {
                DateAndTime: obj["DateAndTime"],
            };
            let update = obj;
            let doc = await Gap1AnodeData.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true,
            });
            await doc.save();
        }
    }
    res.status(200).send("ok");
};
