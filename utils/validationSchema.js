const Joi = require('joi');

module.exports.employeeSchema = Joi.object({
    employee: Joi.object({
        pn: Joi.string().pattern(/^[0-9]+$/).max(5).min(3).required(),
        name: Joi.string().max(50).min(2).required(),
        dept: Joi.string().required(),
        designation: Joi.string().max(50).required(),
        gender: Joi.string().pattern(/^[MF]{1}$/).required(),
        active: Joi.boolean().required(),
        dob: Joi.date(),
        doj: Joi.date(),
        mobile: Joi.number().integer().positive(),
        alternate_contacts: Joi.array().items(Joi.number()),
        intercom: Joi.number().integer().positive()
    }).required()
})