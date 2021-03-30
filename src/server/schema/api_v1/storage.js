const { Joi } = require('koa-joi-router');

const getCustomToken = {
  // header: Joi.object({
  //   authorization: Joi.string().pattern(
  //     /^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
  //   ),
  // }).unknown(),
};

module.exports = { getCustomToken };
