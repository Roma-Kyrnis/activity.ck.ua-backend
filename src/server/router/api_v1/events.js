const Router = require('koa-joi-router');

const {
  apiV1: { events },
} = require('../../controller');
const {
  apiV1: { events: validator },
} = require('../../schema');
const {
  checkTokens: { access },
} = require('../../middleware');
const {
  server: {
    prefix: { EVENTS },
  },
} = require('../../../config');

const router = new Router();

router.prefix(EVENTS);

router.post('/', { validate: validator.create }, access(['user', 'organizer']), events.create);
router.get('/:id', { validate: validator.getOne }, places.getOne);
router.get('/', { validate: validator.getApproved }, places.getApproved);
router.put('/:id', { validate: validator.update }, access(), places.update);
router.delete('/:id', { validate: validator.remove }, access(), places.remove);

module.exports = router;
