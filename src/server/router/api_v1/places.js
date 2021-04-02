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

const router = new Router();

router.prefix(PLACES);

router.post('/', { validate: validator.create }, access(['user', 'organizer']), places.create);
router.get('/:id', { validate: validator.getOne }, places.getOne);
router.get('/', { validate: validator.getApproved }, places.getApproved);
router.put('/:id', { validate: validator.update }, places.update);
router.delete('/:id', { validate: validator.remove }, places.remove);

router.post(
  '/:id/reviews/',
  { validate: validator.addReview },
  access(['user', 'organizer']),
  places.addReview,
);
router.get('/:id/reviews/', { validate: validator.getReviews }, places.getReviews);

router.post(
  '/:id/attends/',
  { validate: validator.addAttend },
  access(['user', 'organizer']),
  places.addAttend,
);

router.post(
  '/:id/favorites/',
  { validate: validator.addFavorite },
  access(['user', 'organizer']),
  places.addFavorite,
);

module.exports = router;
