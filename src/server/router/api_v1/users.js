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

module.exports = router;
