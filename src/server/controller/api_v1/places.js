const {
  createPlace,
  getPlace,
  getPlaces,
  updatePlace,
  deletePlace,
  createOrganization,
  addPhotos,
  getPhotos,
  isUserPlace,
  createReview,
  getReviews: getReviewsDB,
  updateReview: updateReviewDB,
  deleteReview: deleteReviewDB,
} = require('../../../db');
const paginationAndAccessibility = require('./paginationAndAccessibility');
const {
  ROLES: { MODERATOR },
} = require('../../../config');

async function create(ctx) {
  let organizationId = ctx.request.body.organization_id;
  if (!organizationId) {
    const organization = await createOrganization({
      ...ctx.request.body.organization,
      user_id: ctx.state.authPayload.id,
    });
    organizationId = organization.id;
  }

  const dataPlace = {
    ...ctx.request.body.place,
    user_id: ctx.state.authPayload.id,
    organization_id: organizationId,
  };

  const { id: placeId } = await createPlace(dataPlace);

  await addPhotos(ctx.request.body.photos, placeId, 'place_id');

  ctx.body = { message: 'OK' };
}

async function getOne(ctx) {
  const { id: userId } = ctx.state.authPayload;
  const id = parseInt(ctx.request.params.id, 10);

  const place = await getPlace(id, userId);

  ctx.assert(place, 404, `No place with id - ${id}`);

  const photos = await getPhotos(id, 'place_id');

  place.photos = photos;

  ctx.body = { place };
}

async function getApproved(ctx) {
  const { limit, page, filters } = paginationAndAccessibility(ctx.request.query);
  const { type_id: types, category_id: categoryId } = ctx.request.query;

  if (categoryId !== undefined) filters.categoryId = categoryId;
  if (types !== undefined) filters.types = types.split('-');

  const data = await getPlaces(filters, limit, page);

  ctx.body = data;
}

async function update(ctx) {
  const id = parseInt(ctx.request.params.id, 10);
  const { id: userId, role } = ctx.state.authPayload;

  let place;
  if (role !== MODERATOR) {
    const isValid = await isUserPlace(userId, id);

    ctx.assert(isValid, 403, 'Access denied');

    place = await updatePlace({ ...ctx.request.body.place, moderated: false, id });
  } else {
    place = await updatePlace({ ...ctx.request.body.place, id });
  }

  ctx.assert(place, 404, `No place with id ${id}`);

  ctx.body = { message: 'OK' };
}

async function remove(ctx) {
  const id = parseInt(ctx.request.params.id, 10);
  const { id: userId, role } = ctx.state.authPayload;

  if (role !== MODERATOR) {
    const isValid = await isUserPlace(userId, id);

    ctx.assert(isValid, 403, 'Access denied');
  }

  await deletePlace(id);

  ctx.body = { message: 'OK' };
}

async function addReview(ctx) {
  const { id: userId } = ctx.state.authPayload;
  const placeId = parseInt(ctx.request.params.id, 10);

  await createReview({ ...ctx.request.body, user_id: userId, place_id: placeId });

  ctx.body = { message: 'OK' };
}

async function getReviews(ctx) {
  const placeId = parseInt(ctx.request.params.id, 10);

  let { _limit: limit, _page: page } = ctx.request.query;
  limit = parseInt(limit, 10);
  page = parseInt(page, 10);

  const reviews = await getReviewsDB(placeId, limit, page);

  ctx.body = { reviews };
}

async function updateReview(ctx) {
  const reviewId = parseInt(ctx.request.params.reviewId, 10);

  await updateReviewDB({ ...ctx.request.body, id: reviewId });

  ctx.body = { message: 'OK' };
}

async function deleteReview(ctx) {
  const reviewId = parseInt(ctx.request.params.reviewId, 10);

  await deleteReviewDB({ ...ctx.request.body, id: reviewId });

  ctx.body = { message: 'OK' };
}

module.exports = {
  create,
  getOne,
  getApproved,
  update,
  remove,
  addReview,
  getReviews,
  updateReview,
  deleteReview,
};
