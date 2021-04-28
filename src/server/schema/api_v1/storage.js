const { Joi } = require('koa-joi-router');

const getCustomToken = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
};

module.exports = { getCustomToken };
