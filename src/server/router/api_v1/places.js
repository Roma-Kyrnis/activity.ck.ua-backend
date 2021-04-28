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
  ROLES: { EVERY, USER, ORGANIZER },
} = require('../../../config');

const router = Router();

router.prefix(PLACES);

router.post('/', { validate: validator.create }, access([USER, ORGANIZER]), places.create);
router.get('/:id', { validate: validator.getOne }, access([EVERY]), places.getOne);
router.get('/', { validate: validator.getApproved }, access([EVERY]), places.getApproved);
router.put('/:id', { validate: validator.update }, access([USER, ORGANIZER]), places.update);
router.delete('/:id', { validate: validator.remove }, access([USER, ORGANIZER]), places.remove);

router.post(
  '/:id/reviews/',
  { validate: validator.upsertReview },
  access([USER, ORGANIZER]),
  places.upsertReview,
);
router.get('/:id/reviews/', { validate: validator.getReviews }, places.getReviews);
router.put('/:id/reviews/', { validate: validator.updateReview }, access(), places.updateReview);
router.delete('/:id/reviews/', { validate: validator.deleteReview }, access(), places.deleteReview);

module.exports = router;
