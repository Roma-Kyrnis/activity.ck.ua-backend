const Router = require('koa-joi-router');

const auth = require('./auth');
const places = require('./places');
const organizations = require('./organizations');
const storage = require('./storage');
const users = require('./users');
const events = require('./events');
const search = require('./search');

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
router.use(storage);
router.use(users);
router.use(events);
router.use(search);

module.exports = router;
