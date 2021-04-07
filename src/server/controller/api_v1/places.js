const {
  createPlace,
  getPlace,
  getPlaces,
  updatePlace,
  deletePlace,
  createOrganization,
  addPhotos,
  getPhotos,
} = require('../../../db');

const paginationAndAccessibility = require('./paginationAndAccessibility');

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

  const { id } = await createPlace(dataPlace);

  await addPhotos(ctx.request.body.photos, id, 'place_id');

  ctx.body = { message: 'OK' };
}

async function getOne(ctx) {
  const id = parseInt(ctx.request.params.id, 10);

  try {
    const place = await getPlace(id);
    const photos = await getPhotos(id, 'place_id');

    ctx.body = { place: { ...place, photos } };
  } catch (err) {
    err.status = 404;
    err.message = `No place with id - ${id}`;
    ctx.app.emit('error', err, ctx);
  }
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
  await updatePlace({ id, ...ctx.request.body.place });

  ctx.body = { message: 'OK' };
}

async function remove(ctx) {
  const id = parseInt(ctx.request.params.id, 10);
  await deletePlace(id);

  ctx.body = { message: 'OK' };
}

module.exports = { create, getOne, getApproved, update, remove };
