const Router = require('koa-joi-router');

const {
  apiV1: { places },
} = require('../../controller');
const {
  apiV1: { places: validator },
} = require('../../schema');
const {
  checkTokens: { access },
} = require('../../middleware');
const {
  server: {
    prefix: { PLACES },
  },
} = require('../../../config');

const router = Router();

router.prefix(PLACES);

router.post('/', { validate: validator.create }, access(['user', 'organizer']), places.create);
router.get('/:id', { validate: validator.getOne }, places.getOne);
router.get('/', { validate: validator.getApproved }, places.getApproved);
router.put('/:id', { validate: validator.update }, access(), places.update);
router.delete('/:id', { validate: validator.remove }, access(), places.remove);

module.exports = router;
