const { Joi } = require('koa-joi-router');

const places = {
  query: Joi.object({
    name: Joi.string().required(),
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const events = {
  query: Joi.object({
    name: Joi.string().required(),
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

module.exports = { places, events };
