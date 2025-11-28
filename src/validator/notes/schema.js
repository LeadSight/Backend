const Joi = require('joi');

const NotePayloadSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  createdAt: Joi.string().isoDate().required(),
  customerId: Joi.string().required(),
  sales: Joi.string().required(),
})

const EditNotePayloadSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
})

module.exports = {
  NotePayloadSchema,
  EditNotePayloadSchema
};