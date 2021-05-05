const { Joi } = require('koa-joi-router');

const getAll = {};

const update = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  body: Joi.object({
    name: Joi.string().min(3).max(255),
    phones: Joi.array().items(
      Joi.string()
        .pattern(/^\+380\d{9}$/)
        .required(),
    ),
    email: Joi.string().email(),
    moderated: Joi.boolean(),
  }).or('name', 'phones', 'email', 'moderated'),
  type: 'json',
};

const remove = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

module.exports = { getAll, update, remove };
