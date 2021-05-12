const {
  createPlace,
  getPlace,
  getPlaces,
  searchPlacesByAddress,
  updatePlace,
  deletePlace,
  createOrganization,
  addPhotos,
  getPhotos,
  isUserPlace,
  upsertReview: upsertReviewDB,
  getReviews: getReviewsDB,
  updateReview: updateReviewDB,
  deleteReview: deleteReviewDB,
} = require('../../../db');
const { getPaginationAndFilters, getPagination } = require('./utils');
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
  const { id: userId } = ctx.state.authPayload;
  const { limit, page, filters } = getPaginationAndFilters(ctx.request.query);
  const { type_id: types, category_id: categoryId, unexplored, opened } = ctx.request.query;

  if (categoryId !== undefined) filters.categoryId = categoryId;
  if (types !== undefined) filters.types = types.split('-');
  if (unexplored && userId) {
    filters.unexplored = unexplored;
    filters.userId = userId;
  }
  if (opened) filters.opened = opened;

  const data = await getPlaces(filters, limit, page);

  ctx.body = data;
}

async function getByAddress(ctx) {
  const { address } = ctx.request.query;
  const places = await searchPlacesByAddress(address);

  ctx.body = { places };
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

async function upsertReview(ctx) {
  const { id: userId } = ctx.state.authPayload;
  const placeId = parseInt(ctx.request.params.id, 10);

  await upsertReviewDB({ ...ctx.request.body, user_id: userId, place_id: placeId });

  ctx.body = { message: 'OK' };
}

async function getReviews(ctx) {
  const placeId = parseInt(ctx.request.params.id, 10);
  const { limit, page } = getPagination(ctx.request.query);

  const response = await getReviewsDB(placeId, limit, page);

  ctx.body = response;
}

async function updateReview(ctx) {
  const placeId = parseInt(ctx.request.params.id, 10);

  await updateReviewDB({ ...ctx.request.body, place_id: placeId });

  ctx.body = { message: 'OK' };
}

async function deleteReview(ctx) {
  const placeId = parseInt(ctx.request.params.id, 10);
  const userId = parseInt(ctx.request.body.user_id, 10);

  await deleteReviewDB(placeId, userId);

  ctx.body = { message: 'OK' };
}

module.exports = {
  create,
  getOne,
  getApproved,
  getByAddress,
  update,
  remove,
  upsertReview,
  getReviews,
  updateReview,
  deleteReview,
};
