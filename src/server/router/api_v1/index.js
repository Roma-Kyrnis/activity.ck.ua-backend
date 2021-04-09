const Router = require('koa-joi-router');

const auth = require('./auth');
const places = require('./places');
const organizations = require('./organizations');
const users = require('./users');
const events = require('./events');

const {
  server: {
    prefix: { API_V1 },
  },
} = require('../../../config');

const router = Router();

router.prefix(API_V1);

router.use(auth);
router.use(places);
router.use(organizations);
router.use(users);
router.use(events);

module.exports = router;
