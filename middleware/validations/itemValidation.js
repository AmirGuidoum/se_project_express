const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");

const urlValidator = (value, helpers) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    return helpers.error("string.uri");
  }
  return value;
};

const createItemValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().required().custom(urlValidator),
  }),
});

const idParamValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  createItemValidation,
  idParamValidation,
};
