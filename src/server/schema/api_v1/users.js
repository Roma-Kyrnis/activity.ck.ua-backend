const { Joi } = require('koa-joi-router');

const mainPage = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
};

const getVisitedPlaces = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  query: Joi.object({
    _page: Joi.string().pattern(/^[1-9]\d*$/),
    _limit: Joi.string().pattern(/^[1-9]\d*$/),
  }),
};

const getFavoritesPlaces = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  query: Joi.object({
    _page: Joi.string().pattern(/^[1-9]\d*$/),
    _limit: Joi.string().pattern(/^[1-9]\d*$/),
  }),
};

const getPlaces = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  query: Joi.object({
    _page: Joi.string().pattern(/^[1-9]\d*$/),
    _limit: Joi.string().pattern(/^[1-9]\d*$/),
  }),
};

const getEvents = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  query: Joi.object({
    _page: Joi.string().pattern(/^[1-9]\d*$/),
    _limit: Joi.string().pattern(/^[1-9]\d*$/),
  }),
};

const getScheduledEvents = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  query: Joi.object({
    _page: Joi.string().pattern(/^[1-9]\d*$/),
    _limit: Joi.string().pattern(/^[1-9]\d*$/),
  }),
};

module.exports = {
  mainPage,
  getVisitedPlaces,
  getFavoritesPlaces,
  getPlaces,
  getEvents,
  getScheduledEvents,
};
