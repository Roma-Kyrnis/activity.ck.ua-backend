const { createPlace, getPlace, getPlaces } = require('../../../db');
const log = require('../../../utils/logger')(__filename);

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
  let types = ctx.request.query.type_id;
  if (types) types = types.split('-');
  // eslint-disable-next-line no-underscore-dangle
  const limit = parseInt(ctx.request.query._limit, 10);
  const data = await getPlaces(ctx.request.query.category_id, types);

  ctx.body = data;
}

module.exports = { create, getOne, getAll };
