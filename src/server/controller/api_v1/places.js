const {
  createPlace,
  getPlace,
  getPlaces,
  updatePlace,
  deletePlace,
  createOrganization,
  addReview: addPlacesReview,
  getPlacesReviews,
  addAttend: addPlacesAttend,
  addFavorites: addPlacesFavorites,
} = require('../../../db');

const {
  places: {
    default: { LIMIT, PAGE },
  },
} = require('../../../config');

async function savePhotos(placeId, photos) {
  console.log({ photos, placeId });
  const ids = [1, 2, 3];
  return ids;
}

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

  await savePhotos(placeId, ctx.request.body.photos);

  ctx.body = { message: 'OK' };
}

async function getOne(ctx) {
  const id = parseInt(ctx.request.params.id, 10);

  try {
    const place = await getPlace(id);

    ctx.body = { place };
  } catch (err) {
    err.status = 400;
    err.message = `No place with id - ${id}`;
    ctx.app.emit('error', err, ctx);
  }
}

async function getApproved(ctx) {
  let { _limit: limit, _page: page } = ctx.request.query;

  limit = parseInt(limit || LIMIT, 10);
  page = parseInt(page || PAGE, 10);

  const {
    type_id: types,
    category_id: categoryId,
    accessibility,
    dog_friendly: dogFriendly,
    child_friendly: childFriendly,
  } = ctx.request.query;

  const filters = {};

  if (categoryId !== undefined) filters.categoryId = categoryId;
  if (types !== undefined) filters.types = types.split('-');

  if (accessibility !== undefined) filters.accessibility = accessibility;
  if (dogFriendly !== undefined) filters.dogFriendly = dogFriendly;
  if (childFriendly !== undefined) filters.childFriendly = childFriendly;

  const data = await getPlaces(filters, limit, page);

  ctx.body = data;
}

async function update(ctx) {
  const id = parseInt(ctx.request.params.id, 10);
  await updatePlace({ id, ...ctx.request.body.place });

  ctx.body = { message: 'OK' };
}

async function remove(ctx) {
  const id = parseInt(ctx.request.params.id, 10);
  await deletePlace(id);

  ctx.body = { message: 'OK' };
}

async function addReview(ctx) {
  const { id: userId } = ctx.state.authPayload;

  const placeId = parseInt(ctx.request.params.id, 10);
  await addPlacesReview({ ...ctx.request.body, user_id: userId, place_id: placeId });

  ctx.body = { message: 'OK' };
}

async function getReviews(ctx) {
  const placeId = parseInt(ctx.request.params.id, 10);

  let { _limit: limit, _page: page } = ctx.request.query;

  limit = parseInt(limit || LIMIT, 10);
  page = parseInt(page || PAGE, 10);

  const reviews = await getPlacesReviews(placeId, limit, page);

  ctx.body = { reviews };
}

async function addAttend(ctx) {
  const { id: userId } = ctx.state.authPayload;

  const placeId = parseInt(ctx.request.params.id, 10);
  await addPlacesAttend({ user_id: userId, place_id: placeId });

  ctx.body = { message: 'OK' };
}

async function addFavorite(ctx) {
  const { id: userId } = ctx.state.authPayload;

  const placeId = parseInt(ctx.request.params.id, 10);
  await addPlacesFavorites({ user_id: userId, place_id: placeId });

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
  addAttend,
  addFavorite,
};
