const Joi = require("joi");

const noteSchema = Joi.object({
  id: Joi.number(),
  userId: Joi.number(),
  title: Joi.string().max(100).required(),
  content: Joi.string().max(500).required(),
  privacy: Joi.string().required,
  archived: Joi.string(),
  trashed: Joi.string(),
  lastUpdate: Joi.date(),
  createdAt: Joi.date(),
});

module.exports = noteSchema;
