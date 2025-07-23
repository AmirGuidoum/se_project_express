const { celebrate, Joi, Segments } = require("celebrate");

const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const registerValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    avatar: Joi.string().uri().optional(),
  }),
});

module.exports = {
  loginValidation,
  registerValidation,
};
