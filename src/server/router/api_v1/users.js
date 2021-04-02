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
} = require('../../../config');

const router = new Router();

router.prefix(USERS);

router.get('/', { validate: validator.getUser }, access(['user', 'organizer']), users.getUser);
router.get(
  '/main',
  { validate: validator.mainPage },
  access(['user', 'organizer']),
  users.mainPage,
);

router.get(
  '/research',
  { validate: validator.research },
  access(['user', 'organizer']),
  users.research,
);

router.get(
  '/visitedPlaces',
  { validate: validator.getVisitedPlaces },
  access(['user', 'organizer']),
  users.getVisitedPlaces,
);

router.get(
  '/favoritesPlaces',
  { validate: validator.getFavoritesPlaces },
  access(['user', 'organizer']),
  users.getFavoritesPlaces,
);

router.get(
  '/places',
  { validate: validator.getPlaces },
  access(['user', 'organizer']),
  users.getPlaces,
);

router.get(
  '/events',
  { validate: validator.getEvents },
  access(['user', 'organizer']),
  users.getEvents,
);

router.get(
  '/scheduledEvents',
  { validate: validator.getScheduledEvents },
  access(['user', 'organizer']),
  users.getScheduledEvents,
);

router.get(
  '/organizations',
  { validate: validator.getOrganizations },
  access(['organizer']),
  users.getOrganizations,
);

router.post(
  '/review',
  { validate: validator.addReview },
  access(['user', 'organizer']),
  users.addReview,
);
router.get(
  '/reviews',
  { validate: validator.getReviews },
  access(['user', 'organizer']),
  users.getReviews,
);

module.exports = router;
