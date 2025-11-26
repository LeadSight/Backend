const Joi = require('joi');

const NotePayloadSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
});

const CustomerSalesNotePayloadSchema = Joi.object({
  customerId: Joi.string().required(),
  salesId: Joi.string().required(),
});

module.exports = {
  NotePayloadSchema,
  CustomerSalesNotePayloadSchema,
};