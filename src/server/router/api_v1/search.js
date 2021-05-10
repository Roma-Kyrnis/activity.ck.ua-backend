const Router = require('koa-joi-router');

const {
  apiV1: { search },
} = require('../../controller');
const {
  apiV1: { search: validator },
} = require('../../schema');
const {
  server: {
    prefix: { SEARCH },
  },
} = require('../../../config');

const router = Router();

router.prefix(SEARCH);

router.get('/', { validate: validator.global }, search.global);

module.exports = router;
