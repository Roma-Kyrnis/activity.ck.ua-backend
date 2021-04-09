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
  ROLES: { USER, ORGANIZER },
} = require('../../../config');

const router = Router();

router.prefix(EVENTS);

router.post('/', { validate: validator.create }, access([USER, ORGANIZER]), events.create);
router.get('/now/', { validate: validator.getNow }, events.getNow);
router.get('/:id', { validate: validator.getOne }, events.getOne);
router.get('/', { validate: validator.getApproved }, events.getApproved);
router.put('/:id', { validate: validator.update }, access([USER, ORGANIZER]), events.update);
router.delete('/:id', { validate: validator.remove }, access([USER, ORGANIZER]), events.remove);

router.post(
  '/:id/attends/',
  { validate: validator.addAttend },
  access([USER, ORGANIZER]),
  events.addAttend,
);

module.exports = router;
