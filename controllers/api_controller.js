const Gap2AnodeData = require("../models/gap2AnodeData");
const { addMinutes } = require("date-fns");

module.exports.saveGap2AnodeData = (req, res) => {
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
