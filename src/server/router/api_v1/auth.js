const Router = require('koa-joi-router');

const {
  apiV1: { auth },
} = require('../../controller');
const {
  apiV1: { auth: validator },
} = require('../../schema');
const { checkTokens } = require('../../middleware');
const {
  server: {
    prefix: { AUTH },
  },
} = require('../../../config');

const router = new Router();

router.prefix(AUTH);

router.post('/registration', { validate: validator.registration }, auth.registration);
router.post('/login', { validate: validator.login }, auth.login);
router.get('/refresh', { validate: validator.refresh }, checkTokens.refresh(), auth.refresh);
router.get('/logout', { validate: validator.logout }, checkTokens.refresh(), auth.logout);

module.exports = router;
