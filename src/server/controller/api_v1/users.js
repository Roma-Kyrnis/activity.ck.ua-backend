const {
  getUser: getUserDB,
  getVisitedPlaces: getVisitedPlacesDB,
  getFavoritePlaces: getFavoritePlacesDB,
  getUserPlaces,
  getUserEvents,
  getScheduledEvents: getScheduledEventsDB,
  // getUserOrganizations,
  // addReview: addUserReview,
  // getUserReviews,
  // getUserResearch,
} = require('../../../db');

function getUserIdAndPagination(ctx) {
  const { id: userId } = ctx.state.authPayload;

  let { _limit: limit, _page: page } = ctx.request.query;

  limit = parseInt(limit, 10);
  page = parseInt(page, 10);

  return { userId, limit, page };
}

async function getUser(ctx) {
  const { id: userId } = ctx.state.authPayload;

  const user = await getUserDB(userId);

  ctx.body = { user };
}

async function getVisitedPlaces(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const visitedPlaces = await getVisitedPlacesDB(userId, limit, page);

  ctx.body = { visited_places: visitedPlaces };
}

async function getFavoritePlaces(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const favoritesPlaces = await getFavoritePlacesDB(userId, limit, page);

  ctx.body = { favorites_places: favoritesPlaces };
}

async function getPlaces(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const places = await getUserPlaces(userId, limit, page);

  ctx.body = { places };
}

async function getEvents(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const events = await getUserEvents(userId, limit, page);

  ctx.body = { events };
}

async function getScheduledEvents(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const scheduledEvents = await getScheduledEventsDB(userId, limit, page);

  ctx.body = { scheduled_events: scheduledEvents };
}

// async function getResearch(ctx) {
//   const { id: userId } = ctx.state.authPayload;
//   const { category_id: categoryId } = ctx.request.query;

//   const research = await getUserResearch(userId, categoryId);

//   ctx.body = { research };
// }

// async function getOrganizations(ctx) {
//   const { userId, limit, page } = getUserIdAndPagination(ctx);

//   const organizations = await getUserOrganizations(userId, limit, page);

//   ctx.body = { organizations };
// }

// async function addReview(ctx) {
//   const { id: userId } = ctx.state.authPayload;

//   await addUserReview({ ...ctx.request.body, user_id: userId });

//   ctx.body = { message: 'OK' };
// }

// async function getReviews(ctx) {
//   const { userId, limit, page } = getUserIdAndPagination(ctx);

//   const reviews = await getUserReviews(userId, limit, page);

//   ctx.body = { reviews };
// }

module.exports = {
  getUser,
  getVisitedPlaces,
  getFavoritePlaces,
  getScheduledEvents,
  getPlaces,
  getEvents,
  // getResearch,
  // getOrganizations,
  // addReview,
  // getReviews,
};
