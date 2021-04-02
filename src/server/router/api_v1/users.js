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

router.get('/', { validate: validator.mainPage }, access(['user', 'organizer']), users.mainPage);

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

module.exports = router;
