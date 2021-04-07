const Router = require('koa-joi-router');

const {
  apiV1: { organizations },
} = require('../../controller');
const {
  apiV1: { organizations: validator },
} = require('../../schema');
const {
  server: {
    prefix: { ORGANIZATIONS },
  },
} = require('../../../config');

const router = Router();

router.prefix(ORGANIZATIONS);

// router.post('/', { validate: validator.create }, places.create);
// router.get('/:id', { validate: validator.getOne }, places.getOne);
router.get('/', { validate: validator.getAll }, organizations.getAll);
// router.put('/:id', { validate: validator.update }, places.update);
// router.delete('/:id', { validate: validator.remove }, places.remove);

module.exports = router;
