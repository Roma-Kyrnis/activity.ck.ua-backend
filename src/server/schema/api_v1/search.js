const { Joi } = require('koa-joi-router');

const global = {
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

module.exports = { global };
