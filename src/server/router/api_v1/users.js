const Router = require('koa-joi-router');

const {
  apiV1: { users },
} = require('../../controller');
const {
  apiV1: { users: validator },
} = require('../../schema');
const {
  checkTokens: { access },
} = require('../../middleware');
const {
  server: {
    prefix: { USERS },
  },
  ROLES: { USER, ORGANIZER },
} = require('../../../config');

const router = Router();
router.prefix(USERS.MAIN);

const myself = Router();
myself.prefix(USERS.MYSELF);

myself.get('/', { validate: validator.getUser }, access([USER, ORGANIZER]), users.getUser);

myself.post(
  '/visited_places/:placeId',
  { validate: validator.addVisitedPlace },
  access([USER, ORGANIZER]),
  users.addVisitedPlace,
);
myself.get(
  '/visited_places/',
  { validate: validator.getVisitedPlaces },
  access([USER, ORGANIZER]),
  users.getVisitedPlaces,
);
myself.delete(
  '/visited_places/:placeId',
  { validate: validator.deleteVisitedPlace },
  access([USER, ORGANIZER]),
  users.deleteVisitedPlace,
);

myself.post(
  '/favorite_places/:placeId',
  { validate: validator.addFavoritePlace },
  access([USER, ORGANIZER]),
  users.addFavoritePlace,
);
myself.get(
  '/favorite_places/',
  { validate: validator.getFavoritePlaces },
  access([USER, ORGANIZER]),
  users.getFavoritePlaces,
);
myself.delete(
  '/favorite_places/:placeId',
  { validate: validator.deleteFavoritePlace },
  access([USER, ORGANIZER]),
  users.deleteFavoritePlace,
);

myself.post(
  '/scheduled_events/:eventId',
  { validate: validator.addScheduledEvent },
  access([USER, ORGANIZER]),
  users.addScheduledEvent,
);
myself.get(
  '/scheduled_events/',
  { validate: validator.getScheduledEvents },
  access([USER, ORGANIZER]),
  users.getScheduledEvents,
);
myself.delete(
  '/scheduled_events/:eventId',
  { validate: validator.deleteScheduledEvent },
  access([USER, ORGANIZER]),
  users.deleteScheduledEvent,
);

myself.get(
  '/created_places',
  { validate: validator.getPlaces },
  access([USER, ORGANIZER]),
  users.getPlaces,
);

myself.get(
  '/created_events',
  { validate: validator.getEvents },
  access([USER, ORGANIZER]),
  users.getEvents,
);

// myself.get(
//   '/research',
//   { validate: validator.getResearch },
//   access([USER, ORGANIZER]),
//   users.getResearch,
// );

// myself.get(
//   '/created_organizations',
//   { validate: validator.getOrganizations },
//   access([ORGANIZER]),
//   users.getOrganizations,
// );

// myself.post(
//   '/review',
//   { validate: validator.addReview },
//   access([USER, ORGANIZER]),
//   users.addReview,
// );
// myself.get(
//   '/reviews',
//   { validate: validator.getReviews },
//   access([USER, ORGANIZER]),
//   users.getReviews,
// );

router.use(myself);

module.exports = router;
