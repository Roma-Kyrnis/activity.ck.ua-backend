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
    prefix: { USERS, USERS_MYSELF },
  },
  ROLES: { USER, ORGANIZER },
} = require('../../../config');

const router = Router();

router.prefix(USERS);

router.get('/me', { validate: validator.getUser }, access([USER, ORGANIZER]), users.getUser);

const myself = Router();

myself.prefix(USERS_MYSELF);

myself.get(
  '/research',
  { validate: validator.getResearch },
  access([USER, ORGANIZER]),
  users.getResearch,
);

myself.get(
  '/visited_places',
  { validate: validator.getVisitedPlaces },
  access([USER, ORGANIZER]),
  users.getVisitedPlaces,
);

myself.get(
  '/favorite_places',
  { validate: validator.getFavoritesPlaces },
  access([USER, ORGANIZER]),
  users.getFavoritesPlaces,
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

myself.get(
  '/scheduled_events',
  { validate: validator.getScheduledEvents },
  access([USER, ORGANIZER]),
  users.getScheduledEvents,
);

myself.get(
  '/created_organizations',
  { validate: validator.getOrganizations },
  access([ORGANIZER]),
  users.getOrganizations,
);

myself.post(
  '/review',
  { validate: validator.addReview },
  access([USER, ORGANIZER]),
  users.addReview,
);
myself.get(
  '/reviews',
  { validate: validator.getReviews },
  access([USER, ORGANIZER]),
  users.getReviews,
);

router.use(myself);

module.exports = router;
