const Router = require('koa-joi-router');

const apiV1Router = require('./api_v1');

const router = Router();

router.use(apiV1Router);

module.exports = router;
