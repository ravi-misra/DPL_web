const multer = require('multer');
const path = require('path');
const Dept = require("../models/department");


//multer setup
const options = {
    destination: "../uploads/shiftplans",
    filename: function(req, file, cb) {
        cb(null, req.body.costcode + path.extname(file.originalname));
    }
}
const storage = multer.diskStorage(options);

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /xls/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // // Check mime
    // const mimetype = filetypes.test(file.mimetype);
  
    if(extname){
        return cb(null,true);
    } else {
        cb("Only excel files are allowed");
    }
}

const upload = multer({
    storage: storage,
    limits:{fileSize: 2*1000*1000}, //Size in bytes
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('attendance-sheet');

module.exports.renderShiftPlanForm = async (req, res) => {
    let hodDeps = await Dept.find({hod: req.user._id});
    let hodObject = {};
    for (let d of hodDeps) {
        hodObject[d.costcode] = d.name;
    }
}