const Router = require('koa-joi-router');

const myselfRouter = require('./myself');

const {
  server: {
    prefix: { USERS },
  },
} = require('../../../../config');

const router = Router();
router.prefix(USERS.path);

router.use(myselfRouter);

module.exports = router;
