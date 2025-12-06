const Joi = require("joi")

const promptPayloadSchema = Joi.object({
    age: Joi.number().positive().required(),
    job: Joi.string().required(),
    balance: Joi.number().required(),
    poutcome: Joi.string().required(),
    campaign: Joi.number().required(),
    duration: Joi.number().required(),
    cons_price_idx: Joi.number().required(),
    cons_conf_idx: Joi.number().required(),
})

module.exports = {
    promptPayloadSchema
}