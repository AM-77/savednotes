const Joi = require("joi");

const userSchema = Joi.object({
  id: Joi.number(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(
    new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
    ),
  ),
  email: Joi.string().email(),
});

module.exports = userSchema;
