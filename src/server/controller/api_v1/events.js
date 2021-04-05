const {
  createEvent,
  getEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  addPhotos,
  getPhotos,
} = require('../../../db');

const {
  places: {
    default: { LIMIT, PAGE },
  },
} = require('../../../config');

async function create(ctx) {
  const event = {
    ...ctx.request.body.event,
    user_id: ctx.state.authPayload.id,
  };

  const { id } = await createEvent(event);

  await addPhotos(ctx.request.body.photos, id, 'event_id');

  ctx.body = { message: 'OK' };
}

async function getOne(ctx) {
  const id = parseInt(ctx.request.params.id, 10);

  try {
    const event = await getEvent(id);
    const photos = await getPhotos(id, 'place_id');

    ctx.body = { event, photos };
  } catch (err) {
    err.status = 400;
    err.message = `No event with id - ${id}`;
    ctx.app.emit('error', err, ctx);
  }
}

async function getApproved(ctx) {
  let { _limit: limit, _page: page } = ctx.request.query;
  limit = parseInt(limit, 10) || LIMIT;
  page = parseInt(page, 10) || PAGE;

  const {
    accessibility,
    dog_friendly: dogFriendly,
    child_friendly: childFriendly,
  } = ctx.request.query;

  const filters = {};

  if (accessibility !== undefined) filters.accessibility = accessibility;
  if (dogFriendly !== undefined) filters.dogFriendly = dogFriendly;
  if (childFriendly !== undefined) filters.childFriendly = childFriendly;

  const events = await getEvents(filters, limit, page);

  ctx.body = { events };
}

async function update(ctx) {
  const id = parseInt(ctx.request.params.id, 10);

  const event = await updateEvent({ id, ...ctx.request.body.place });

  ctx.assert(event, 400, `No event with id ${id}`);

  ctx.body = { message: 'OK' };
}

async function remove(ctx) {
  const id = parseInt(ctx.request.params.id, 10);

  await deleteEvent(id);

  ctx.body = { message: 'OK' };
}

module.exports = { create, getOne, getApproved, update, remove };
