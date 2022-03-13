const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Shift_sch = require('./shift_sch');


const EmployeeSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    dept: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: 'M'
    },
    role: {
        type: String,
        default: 'ShiftIC'
    },
    active: {
        type: Boolean,
        default: true
    },
    reports_to: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    dob: Date,
    doj: Date,
    mobile: {
        type: String,
        default: ''
    },
    alternate_contacts: {
        type: String,
        default: ''
    },
    intercom: String,
    qtr_no: String,
    blood_grp: String,
    hash: {
        type: String,
        default: "96159301397ed92f2a12b4a363588a3ec58f0c2bdfed261e436b0ec740b3a951bf2582193a7aed6049f066998ab856be0dfd5946efa8e6685e8e73c50d9d893e4f159ff8dcc963c1a04effe019c6da874ea276dd4b5f724dc288b31aaba54e9e504b74d77fd583250222286dccf55a4e8522c8b3a5130ea215aec0c801b2cab981f41ee28d3bc26c2339187acb070c4f958108edee74b8198b5f38cc4524a3236b5aa23a7c291dcb19d715f4743f5d2c0cec90396a1903d4bb2c153c7b773452c0550975d6131f9f0871dd421a3fb5ffda8c161bb3a3ec998ba1296ef338183a8859255d3902b1cd0a282e2f41e6a08fbc88ec8d1a111c220a5a24183b1f44da9a9a1b4d9f888f2b2833bfd3fde1917c59a4ba38f29357f4bbbb4a19e089587bfba9105bb05e183398f65c716cfbb84f24320c358c26bc328d426bea64a247771cf75e0e3196fcc0cfcc2789033c52a3c1f97d43a895cecf07d57f54f401f50abf96ae70be08210b9fc69d0e59f91e932e8dff3b162f5d29c311d9b2d6ed3dd5ebb88d09c6d4ed34d2f70dd442ce952f0548d1a722afaa62468aeb1eeb95051aae59661d84500337fbb0241ae8da990689a85d873f48f5a014ff56bdb10ed4a233a4dd86586fc97c744f94a2cbfb38691080c02e42b4d32e111bb3c3499853722ba5e39c3bbeaaa7c6519cf24aeeafa2aaf75015db4891a5d83918697972683d"
    },
    salt: {
        type: String,
        default: "809efb2ebc7a74ae7fdde16307c573e4a702fba9fb1cbbdbd0a7dc5b40021a8a"
    }
})

EmployeeSchema.post('findOneAndDelete', async function(emp) {
    await Shift_sch.deleteMany({employee: emp._id});
})

EmployeeSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Employee', EmployeeSchema);