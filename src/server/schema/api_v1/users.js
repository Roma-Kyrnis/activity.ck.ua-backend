const { Joi } = require('koa-joi-router');

const getUser = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
};

const getVisitedPlaces = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const getFavoritePlaces = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const getScheduledEvents = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const getPlaces = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const getEvents = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

// const getResearch = {
//   header: Joi.object({
//     authorization: Joi.string()
//       .pattern(/^[a-zA-Z]+ .+$/)
//       .required(),
//   }).unknown(),
//   query: Joi.object({
//     category_id: Joi.string().min(3),
//   }),
// };

// const getOrganizations = {
//   header: Joi.object({
//     authorization: Joi.string()
//       .pattern(/^[a-zA-Z]+ .+$/)
//       .required(),
//   }).unknown(),
//   query: Joi.object({
//     _page: Joi.string()
//       .pattern(/^[1-9]\d*$/)
//       .required(),
//     _limit: Joi.string()
//       .pattern(/^[1-9]\d*$/)
//       .required(),
//   }),
// };

// const addReview = {
//   header: Joi.object({
//     authorization: Joi.string()
//       .pattern(/^[a-zA-Z]+ .+$/)
//       .required(),
//   }).unknown(),
//   body: Joi.object({
//     place_id: Joi.string()
//       .pattern(/^[1-9]\d*$/)
//       .required(),
//     rating: Joi.string()
//       .pattern(/^[1-9]\d*$/)
//       .required(),
//     review_text: Joi.string()
//       .pattern(/^[1-9]\d*$/)
//       .required(),
//   }),
//   type: 'json',
// };

// const getReviews = {
//   header: Joi.object({
//     authorization: Joi.string()
//       .pattern(/^[a-zA-Z]+ .+$/)
//       .required(),
//   }).unknown(),
//   query: Joi.object({
//     place_id: Joi.string().pattern(/^[1-9]\d*$/),
//     _page: Joi.string()
//       .pattern(/^[1-9]\d*$/)
//       .required(),
//     _limit: Joi.string()
//       .pattern(/^[1-9]\d*$/)
//       .required()
//       .required(),
//   }),
// };

module.exports = {
  getUser,
  getVisitedPlaces,
  getFavoritePlaces,
  getScheduledEvents,
  getPlaces,
  getEvents,
  // getOrganizations,
  // getResearch,
  // addReview,
  // getReviews,
};
