const Router = require('koa-joi-router');

const {
  apiV1: { storage },
} = require('../../controller');
const {
  apiV1: { storage: validator },
} = require('../../schema');
const {
  checkTokens: { access },
} = require('../../middleware');
const {
  server: {
    prefix: { STORAGE },
  },
  ROLES: { USER, ORGANIZER },
} = require('../../../config');

const router = new Router();

router.prefix(STORAGE);

router.get(
  '/token',
  { validate: validator.getCustomToken },
  access([USER, ORGANIZER]),
  storage.getCustomToken,
);

module.exports = router;
