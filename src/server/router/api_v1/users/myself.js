const Router = require('koa-joi-router');

const {
  apiV1: { users },
} = require('../../../controller');
const {
  apiV1: { users: validator },
} = require('../../../schema');
const {
  checkTokens: { access },
} = require('../../../middleware');
const {
  server: {
    prefix: { USERS },
  },
  ROLES: { USER, ORGANIZER },
} = require('../../../../config');

const router = Router();
router.prefix(USERS.MYSELF.path);

router.get('/', { validate: validator.getUser }, access([USER, ORGANIZER]), users.getUser);

router.post(
  '/visited_places/:placeId',
  { validate: validator.addVisitedPlace },
  access([USER, ORGANIZER]),
  users.addVisitedPlace,
);
router.get(
  '/visited_places/',
  { validate: validator.getVisitedPlaces },
  access([USER, ORGANIZER]),
  users.getVisitedPlaces,
);
router.delete(
  '/visited_places/:placeId',
  { validate: validator.deleteVisitedPlace },
  access([USER, ORGANIZER]),
  users.deleteVisitedPlace,
);

router.post(
  '/favorite_places/:placeId',
  { validate: validator.addFavoritePlace },
  access([USER, ORGANIZER]),
  users.addFavoritePlace,
);
router.get(
  '/favorite_places/',
  { validate: validator.getFavoritePlaces },
  access([USER, ORGANIZER]),
  users.getFavoritePlaces,
);
router.delete(
  '/favorite_places/:placeId',
  { validate: validator.deleteFavoritePlace },
  access([USER, ORGANIZER]),
  users.deleteFavoritePlace,
);

router.post(
  '/scheduled_events/:eventId',
  { validate: validator.addScheduledEvent },
  access([USER, ORGANIZER]),
  users.addScheduledEvent,
);
router.get(
  '/scheduled_events/',
  { validate: validator.getScheduledEvents },
  access([USER, ORGANIZER]),
  users.getScheduledEvents,
);
router.delete(
  '/scheduled_events/:eventId',
  { validate: validator.deleteScheduledEvent },
  access([USER, ORGANIZER]),
  users.deleteScheduledEvent,
);

router.get(
  '/created_places',
  { validate: validator.getPlaces },
  access([USER, ORGANIZER]),
  users.getPlaces,
);

router.get(
  '/created_events',
  { validate: validator.getEvents },
  access([USER, ORGANIZER]),
  users.getEvents,
);

// router.get(
//   '/research',
//   { validate: validator.getResearch },
//   access([USER, ORGANIZER]),
//   users.getResearch,
// );

// router.get(
//   '/created_organizations',
//   { validate: validator.getOrganizations },
//   access([ORGANIZER]),
//   users.getOrganizations,
// );

// router.post(
//   '/review',
//   { validate: validator.addReview },
//   access([USER, ORGANIZER]),
//   users.addReview,
// );
// router.get(
//   '/reviews',
//   { validate: validator.getReviews },
//   access([USER, ORGANIZER]),
//   users.getReviews,
// );

module.exports = router;
