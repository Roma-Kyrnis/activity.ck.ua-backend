const { Joi } = require('koa-joi-router');

const mainPage = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
};

module.exports = { mainPage };
