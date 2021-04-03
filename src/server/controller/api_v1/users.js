const {
  getUser: getUserDB,
  getPlace,
  getEvent,
  getUsersVisitedPlaces,
  getUsersFavoritesPlaces,
  getUsersPlaces,
  getUsersEvents,
  getUsersScheduledEvents,
  getUsersOrganizations,
  addReview: addUsersReview,
  getUsersReviews,
  getUsersResearch,
} = require('../../../db');

const {
  users: {
    default: { ITEMS_IN_SECTION, PAGE, LIMIT },
    section: { EVENT_ID, PLACE_ID },
  },
} = require('../../../config');

function getUserIdAndPagination(ctx) {
  const { id: userId } = ctx.state.authPayload;

  let { _limit: limit, _page: page } = ctx.request.query;

  limit = parseInt(limit || LIMIT, 10);
  page = parseInt(page || PAGE, 10);

  return { userId, limit, page };
}

async function getUser(ctx) {
  const { id: userId } = ctx.state.authPayload;

  const user = await getUserDB(userId);

  ctx.body = { user };
}

const getSectionInfo = async (userId, sectionFunction, sectionIdKey) => {
  const sectionResults = await sectionFunction(userId, ITEMS_IN_SECTION, PAGE);

  const fullSectionResults = [];

  for await (const { [sectionIdKey]: sectionId } of sectionResults) {
    // 1
    // const section = await getBaseActivity(sectionId);

    // 2
    let section;
    if (sectionIdKey === PLACE_ID) {
      section = await getPlace(sectionId);
    } else {
      section = await getEvent(sectionId);
    }

    fullSectionResults.push({
      id: sectionId,
      name: section.name,
      main_photo: section.main_photo,
    });
  }

  return fullSectionResults;
};

async function activity(ctx) {
  const { id: userId } = ctx.state.authPayload;

  const activities = await Promise.all([
    getSectionInfo(userId, getUsersVisitedPlaces, PLACE_ID),
    getSectionInfo(getUsersFavoritesPlaces, PLACE_ID),
    getSectionInfo(getUsersPlaces, PLACE_ID),
    getSectionInfo(getUsersEvents, EVENT_ID),
    getSectionInfo(getUsersScheduledEvents, EVENT_ID),
  ]);

  ctx.body = {
    visited_places: activities[0],
    favorites_places: activities[1],
    user_places: activities[2],
    user_events: activities[3],
    scheduled_events: activities[4],
  };
}

async function getResearch(ctx) {
  const { id: userId } = ctx.state.authPayload;
  const { category_id: categoryId } = ctx.request.query;

  const research = await getUsersResearch(userId, categoryId);

  ctx.body = { research };
}

async function getVisitedPlaces(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const visitedPlaces = await getUsersVisitedPlaces(userId, limit, page);

  ctx.body = { visited_places: visitedPlaces };
}

async function getFavoritesPlaces(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const favoritesPlaces = await getUsersFavoritesPlaces(userId, limit, page);

  ctx.body = { favorites_places: favoritesPlaces };
}

async function getPlaces(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const places = await getUsersPlaces(userId, limit, page);

  ctx.body = { places };
}

async function getEvents(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const events = await getUsersEvents(userId, limit, page);

  ctx.body = { events };
}

async function getScheduledEvents(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const scheduledEvents = await getUsersScheduledEvents(userId, limit, page);

  ctx.body = { scheduled_events: scheduledEvents };
}

async function getOrganizations(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const organizations = await getUsersOrganizations(userId, limit, page);

  ctx.body = { organizations };
}

async function addReview(ctx) {
  const { id: userId } = ctx.state.authPayload;

  await addUsersReview({ ...ctx.request.body, user_id: userId });

  ctx.body = { message: 'OK' };
}

async function getReviews(ctx) {
  const { userId, limit, page } = getUserIdAndPagination(ctx);

  const reviews = await getUsersReviews(userId, limit, page);

  ctx.body = { reviews };
}

module.exports = {
  getUser,
  activity,
  getResearch,
  getVisitedPlaces,
  getFavoritesPlaces,
  getPlaces,
  getEvents,
  getScheduledEvents,
  getOrganizations,
  addReview,
  getReviews,
};
