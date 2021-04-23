const { Joi } = require('koa-joi-router');

const {
  places: {
    schema: { TYPE_ID },
  },
} = require('../../../config');

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

const places = {
  query: Joi.object({
    name: Joi.string().required(),
    category_id: Joi.string(),
    type_id: Joi.string().pattern(TYPE_ID),
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }).xor('category_id', 'type_id'),
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

module.exports = { global, places, events };
