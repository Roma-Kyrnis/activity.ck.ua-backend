const {
  getUser: getUserDB,
  addVisitedPlace: addVisitedPlaceDB,
  getVisitedPlaces: getVisitedPlacesDB,
  detachVisitedPlace: detachVisitedPlaceDB,
  addFavoritePlace: addFavoritePlaceDB,
  getFavoritePlaces: getFavoritePlacesDB,
  detachFavoritePlace: detachFavoritePlaceDB,
  addScheduledEvent: addScheduledEventDB,
  getScheduledEvents: getScheduledEventsDB,
  detachScheduledEvent: detachScheduledEventDB,
  getUserPlaces,
  getUserEvents,
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

async function addVisitedPlace(ctx) {
  const { id: userId } = ctx.state.authPayload;
  const placeId = parseInt(ctx.request.params.placeId, 10);

  await addVisitedPlaceDB(placeId, userId);

  ctx.body = { message: 'OK' };
}

async function getVisitedPlaces(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const visitedPlaces = await getVisitedPlacesDB(userId, limit, page);

  ctx.body = visitedPlaces;
}

async function deleteVisitedPlace(ctx) {
  const { id: userId } = ctx.state.authPayload;
  const placeId = parseInt(ctx.request.params.placeId, 10);

  await detachVisitedPlaceDB(placeId, userId);

  ctx.body = { message: 'OK' };
}

async function addFavoritePlace(ctx) {
  const { id: userId } = ctx.state.authPayload;
  const placeId = parseInt(ctx.request.params.placeId, 10);

  await addFavoritePlaceDB(placeId, userId);

  ctx.body = { message: 'OK' };
}

async function getFavoritePlaces(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const favoritesPlaces = await getFavoritePlacesDB(userId, limit, page);

  ctx.body = favoritesPlaces;
}

async function deleteFavoritePlace(ctx) {
  const { id: userId } = ctx.state.authPayload;
  const placeId = parseInt(ctx.request.params.placeId, 10);

  await detachFavoritePlaceDB(placeId, userId);

  ctx.body = { message: 'OK' };
}

async function addScheduledEvent(ctx) {
  const { id: userId } = ctx.state.authPayload;
  const eventId = parseInt(ctx.request.params.eventId, 10);

  await addScheduledEventDB(eventId, userId);

  ctx.body = { message: 'OK' };
}

async function getScheduledEvents(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const scheduledEvents = await getScheduledEventsDB(userId, limit, page);

  ctx.body = scheduledEvents;
}

async function deleteScheduledEvent(ctx) {
  const { id: userId } = ctx.state.authPayload;
  const eventId = parseInt(ctx.request.params.eventId, 10);

  await detachScheduledEventDB(eventId, userId);

  ctx.body = { message: 'OK' };
}

async function getPlaces(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const response = await getUserPlaces(userId, limit, page);

  ctx.body = response;
}

async function getEvents(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const response = await getUserEvents(userId, limit, page);

  ctx.body = response;
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
  addVisitedPlace,
  getVisitedPlaces,
  deleteVisitedPlace,
  addFavoritePlace,
  getFavoritePlaces,
  deleteFavoritePlace,
  addScheduledEvent,
  getScheduledEvents,
  deleteScheduledEvent,
  getPlaces,
  getEvents,
  // getResearch,
  // getOrganizations,
  // addReview,
  // getReviews,
};
