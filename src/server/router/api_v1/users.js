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
} = require('../../../config');

const router = Router();

router.prefix(USERS);

router.get('/me', { validate: validator.getUser }, access(['user', 'organizer']), users.getUser);

const myself = Router();

myself.prefix(USERS_MYSELF);

myself.get(
  '/research',
  { validate: validator.getResearch },
  access(['user', 'organizer']),
  users.getResearch,
);

myself.get(
  '/visited_places',
  { validate: validator.getVisitedPlaces },
  access(['user', 'organizer']),
  users.getVisitedPlaces,
);

myself.get(
  '/favorite_places',
  { validate: validator.getFavoritesPlaces },
  access(['user', 'organizer']),
  users.getFavoritesPlaces,
);

myself.get(
  '/created_places',
  { validate: validator.getPlaces },
  access(['user', 'organizer']),
  users.getPlaces,
);

myself.get(
  '/created_events',
  { validate: validator.getEvents },
  access(['user', 'organizer']),
  users.getEvents,
);

myself.get(
  '/scheduled_events',
  { validate: validator.getScheduledEvents },
  access(['user', 'organizer']),
  users.getScheduledEvents,
);

myself.get(
  '/created_organizations',
  { validate: validator.getOrganizations },
  access(['organizer']),
  users.getOrganizations,
);

myself.post(
  '/review',
  { validate: validator.addReview },
  access(['user', 'organizer']),
  users.addReview,
);
myself.get(
  '/reviews',
  { validate: validator.getReviews },
  access(['user', 'organizer']),
  users.getReviews,
);

router.use(myself);

module.exports = router;
