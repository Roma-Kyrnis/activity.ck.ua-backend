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
router.get('/places', { validate: validator.places }, search.places);
router.get('/events', { validate: validator.events }, search.events);

module.exports = router;
