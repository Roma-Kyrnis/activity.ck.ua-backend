const Router = require('koa-joi-router');

const places = require('./places');

const {
  server: {
    prefix: { API_V1 },
  },
} = require('../../../config');

const router = new Router();

router.prefix(API_V1);

router.use(places);

module.exports = router;
