const {
  createPlace,
  getPlace,
  getPlaces,
  updatePlace,
  deletePlace,
  createOrganization,
  addPhotos,
  getPhotos,
  getPlaceEvents,
  getEvents: getEventsDB,
} = require('../../../db');

const {
  places: {
    default: { LIMIT, PAGE, EVENTS },
  },
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

  const { id } = await createPlace(dataPlace);

  await addPhotos(ctx.request.body.photos, id, 'place_id');

  ctx.body = { message: 'OK' };
}

async function getOne(ctx) {
  const id = parseInt(ctx.request.params.id, 10);

  try {
    const place = await getPlace(id);
    const photos = await getPhotos(id, 'place_id');
    const { events } = await getPlaceEvents(id);

    ctx.body = { place, photos, events };
  } catch (err) {
    err.status = 400;
    err.message = `No place with id - ${id}`;
    ctx.app.emit('error', err, ctx);
  }
}

async function getEvents(ctx) {
  const id = parseInt(ctx.request.params.id, 10);

  let { _limit: limit, _page: page } = ctx.request.query;
  limit = parseInt(limit, 10) || EVENTS.LIMIT;
  page = parseInt(page, 10) || EVENTS.PAGE;

  const {
    accessibility,
    dog_friendly: dogFriendly,
    child_friendly: childFriendly,
  } = ctx.request.query;

  const filters = {};

  if (accessibility !== undefined) filters.accessibility = accessibility;
  if (dogFriendly !== undefined) filters.dogFriendly = dogFriendly;
  if (childFriendly !== undefined) filters.childFriendly = childFriendly;

  const events = await getEventsDB({ ...filters, place_id: id }, limit, page);

  ctx.body = { events };
}

async function getApproved(ctx) {
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

module.exports = { create, getOne, getEvents, getApproved, update, remove };
