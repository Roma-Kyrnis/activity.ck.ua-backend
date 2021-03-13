const { createPlace, getPlace, getPlaces, updatePlace, deletePlace } = require('../../../db');

const {
  places: {
    default: { LIMIT, PAGE },
  },
} = require('../../../config');

async function createOrganization(organization) {
  console.log({ organization });
  const id = 1;
  return id;
}

async function savePhotos(placeId, photos) {
  console.log({ photos, placeId });
  const ids = [1, 2, 3];
  return ids;
}

async function create(ctx) {
  const organizationId =
    ctx.request.body.organization_id || (await createOrganization(ctx.request.body.organization));

  const dataPlace = {
    ...ctx.request.body.place,
    user_id: 1, // CHANGE to truly user id from JWT token
    organization_id: organizationId,
  };

  const { id: placeId } = await createPlace(dataPlace);

  await savePhotos(placeId, ctx.request.body.photos);

  ctx.body = { message: 'OK' };
}

async function getOne(ctx) {
  const id = parseInt(ctx.request.params.id, 10);

  if (!id || Number.isNaN(id)) ctx.throw(400, 'Incorrect id');
  try {
    const place = await getPlace(id);

    ctx.body = { place };
  } catch (err) {
    err.status = 400;
    err.message = `No place with id - ${id}`;
    ctx.app.emit('error', err, ctx);
  }
}

async function getAll(ctx) {
  // eslint-disable-next-line no-underscore-dangle
  const limit = parseInt(ctx.request.query._limit || LIMIT, 10);
  // eslint-disable-next-line no-underscore-dangle
  const page = parseInt(ctx.request.query._page || PAGE, 10);

  const {
    type_id: types,
    category_id: categoryId,
    accessibility,
    dog_friendly: dogFriendly,
    child_friendly: childFriendly,
  } = ctx.request.query;

  const filters = {
    categoryId,
    types: types ? types.split('-') : undefined,
    accessibility: accessibility === 'true',
    dogFriendly: dogFriendly === 'true',
    childFriendly: childFriendly === 'true',
  };

  const data = await getPlaces(filters, limit, page);

  ctx.body = data;
}

async function update(ctx) {
  const id = parseInt(ctx.request.params.id, 10);
  await updatePlace({ id, place: ctx.request.body.place });

  ctx.body = { message: 'OK' };
}

async function remove(ctx) {
  const id = parseInt(ctx.request.params.id, 10);
  await deletePlace(id);

  ctx.body = { message: 'OK' };
}

module.exports = { create, getOne, getAll, update, remove };
