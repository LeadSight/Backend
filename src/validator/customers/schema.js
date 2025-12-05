const Joi = require('joi');

const CustomerPayloadSchema = Joi.object({
  customerName: Joi.string().required(),
  age: Joi.number().required(),
  job: Joi.string().required(),
  marital: Joi.string().required(),
  education: Joi.string().required(),
  defaultValue: Joi.string().required(),
  balance: Joi.number().required(),
  housing: Joi.string().required(),
  hasLoan: Joi.string().required(),
  contact: Joi.string().required(),
  month: Joi.string().required(),
  day: Joi.string().required(),
  duration: Joi.number().required(),
  campaign: Joi.number().required(),
  pdays: Joi.number().required(),
  previous: Joi.number().required(),
  poutcome: Joi.string().required(),
  emp_var_rate: Joi.number().required(),
  cons_price_idx: Joi.number().required(),
  cons_conf_idx: Joi.number().required(),
  euribor3m: Joi.number().required(),
  nr_employed: Joi.number().required(),
});

module.exports = {
  CustomerPayloadSchema
};