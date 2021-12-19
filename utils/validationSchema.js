const Joi = require('joi');

module.exports.joiEmployeeSchema = Joi.object({
    employee: Joi.object({
        username: Joi.string().pattern(/^[0-9]+$/).max(5).min(3).required(),
        name: Joi.string().max(50).min(2).required(),
        dept: Joi.string().required(),
        designation: Joi.string().max(50).required(),
        active: Joi.boolean(),
        dob: Joi.date(),
        doj: Joi.date(),
        mobile: Joi.number().integer().positive().max(9999999999),
        alternate_contacts: Joi.array().items(Joi.number().max(9999999999)),
        intercom: Joi.number().integer().positive().max(99999),
        password: Joi.string().min(4).max(20).required()
    }).required()
});

module.exports.joiContractWorkerSchema = Joi.object({
    contractworker: Joi.object({
        passno: Joi.string().pattern(/^[0-9]+$/).max(10).required(),
        name: Joi.string().max(50).min(2).required(),
        dutyarea: Joi.string().required(),
        designation: Joi.string().max(50).required(),
        validity: Joi.date(),
        mobile: Joi.number().integer().positive().max(9999999999)
    }).required()
})

module.exports.joiDepartmentSchema = Joi.object({
    department: Joi.object({
        name: Joi.string().max(50).min(2).required(),
        costcode: Joi.string().pattern(/^[0-9]+$/).max(10).required(),
        area: Joi.string().required()
    }).required()
})

module.exports.joiContractorSchema = Joi.object({
    contractor: Joi.object({
        name: Joi.string().max(50).min(2).required(),
        address: Joi.string(),
        contactperson: Joi.string(),
        contact: Joi.array().items(Joi.number())
    }).required()
})


module.exports.joiContractDetailSchema = Joi.object({
    contractordetail: Joi.object({
        wo: Joi.string().required(),
        from: Joi.date(),
        to: Joi.date()
    }).required()
})

module.exports.joiShiftScheduleSchema = Joi.object({
    shiftschedule: Joi.object({
        employee: Joi.string().required(),
        date: Joi.date().required(),
        shift: Joi.string().max(1).min(1).required()
    }).required()
})

module.exports.joiCasualAttendanceSchema = Joi.object({
    casualattendance: Joi.object({
        casual: Joi.string().required(),
        date: Joi.date().required(),
        shift: Joi.string().max(1).min(1).required()
    }).required()
})