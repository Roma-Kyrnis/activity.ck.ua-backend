const Router = require('koa-joi-router');

const {
  apiV1: { organizations },
} = require('../../controller');
const {
  apiV1: { organizations: validator },
} = require('../../schema');
const {
  checkTokens: { access },
} = require('../../middleware');
const {
  server: {
    prefix: { ORGANIZATIONS },
  },
} = require('../../../config');

const router = new Router();

router.prefix(ORGANIZATIONS);

router.get('/proposed', { validate: validator.getProposed }, organizations.getProposed);
router.get('/', { validate: validator.getAll }, organizations.getAll);
router.put('/:id', { validate: validator.update }, access(), organizations.update);
router.delete('/:id', { validate: validator.remove }, access(), organizations.remove);

module.exports = router;
