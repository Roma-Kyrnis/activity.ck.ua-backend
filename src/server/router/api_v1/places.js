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
  ROLES: { USER, ORGANIZER },
} = require('../../../config');

const router = Router();

router.prefix(PLACES);

router.post('/', { validate: validator.create }, access([USER, ORGANIZER]), places.create);
router.get('/:id', { validate: validator.getOne }, places.getOne);
router.get('/', { validate: validator.getApproved }, places.getApproved);
router.put('/:id', { validate: validator.update }, access([USER, ORGANIZER]), places.update);
router.delete('/:id', { validate: validator.remove }, access([USER, ORGANIZER]), places.remove);

router.post(
  '/:id/visited_places/',
  { validate: validator.addVisited },
  access([USER, ORGANIZER]),
  places.addVisited,
);
router.delete(
  '/:id/visited_places/',
  { validate: validator.deleteVisited },
  access([USER, ORGANIZER]),
  places.deleteVisited,
);

router.post(
  '/:id/favorite_places/',
  { validate: validator.addFavorite },
  access([USER, ORGANIZER]),
  places.addFavorite,
);
router.delete(
  '/:id/favorite_places/',
  { validate: validator.deleteFavorite },
  access([USER, ORGANIZER]),
  places.deleteFavorite,
);

// router.post(
//   '/:id/reviews/',
//   { validate: validator.addReview },
//   access([USER, ORGANIZER]),
//   places.addReview,
// );
// router.get('/:id/reviews/', { validate: validator.getReviews }, places.getReviews);

module.exports = router;
