const Router = require('koa-joi-router');

const {
  apiV1: { auth },
} = require('../../controller');
const {
  apiV1: { auth: validator },
} = require('../../schema');
const {
  checkTokens: { refresh },
} = require('../../middleware');
const {
  server: {
    prefix: { AUTH },
  },
} = require('../../../config');

const router = Router();

router.prefix(AUTH);

router.post('/registration', { validate: validator.registration }, auth.registration);
router.post('/login', { validate: validator.login }, auth.login);
router.get('/refresh', { validate: validator.refresh }, refresh(), auth.refresh);
router.get('/logout', { validate: validator.logout }, refresh(), auth.logout);

router.patch('/password/forgot', { validate: validator.forgotPassword }, auth.forgotPassword);
router.put('/password/change', { validate: validator.changePassword }, auth.changePassword);
router.head('/email/:email/code/:code', { validate: validator.checkCode }, auth.checkCode);

module.exports = router;
