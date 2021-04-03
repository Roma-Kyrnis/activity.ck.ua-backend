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

router.post(
  '/',
  { validate: validator.create },
  access(['user', 'organizer']),
  organizations.create,
);
router.get('/proposed', { validate: validator.getProposed }, organizations.getProposed);
router.get('/approved', { validate: validator.getApproved }, organizations.getApproved);
router.get('/', { validate: validator.getAll }, organizations.getAll);
router.put('/:id', { validate: validator.update }, organizations.update);
router.delete('/:id', { validate: validator.remove }, organizations.remove);

module.exports = router;
