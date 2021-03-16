const Router = require('koa-joi-router');

const auth = require('./auth');
const places = require('./places');

const {
  server: {
    prefix: { API_V1 },
  },
} = require('../../../config');

const router = new Router();

router.prefix(API_V1);

router.use(auth);
router.use(places);

module.exports = router;
