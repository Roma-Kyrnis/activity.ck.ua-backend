const {
  createEvent,
  getEvent,
  getEvents,
  getCurrentEvents,
  updateEvent,
  deleteEvent,
  addPhotos,
  getPhotos,
  addEventAttend,
} = require('../../../db');
const paginationAndAccessibility = require('./paginationAndAccessibility');

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

  const event = await getEvent(id);
  const photos = await getPhotos(id, 'event_id');

  ctx.assert(event, 400, `Cannot find event with id ${id}`);

  ctx.body = { event, photos };
}

async function getApproved(ctx) {
  const { start_time: startTime } = ctx.request.query;
  const { limit, page, filters } = paginationAndAccessibility(ctx.request.query);

  const events = await getEvents(startTime, limit, page, filters);

  ctx.body = { ...events };
}

async function getNow(ctx) {
  const { limit, page, filters } = paginationAndAccessibility(ctx.request.query);

  const events = await getCurrentEvents(limit, page, filters);

  ctx.body = { ...events };
}

async function update(ctx) {
  const id = parseInt(ctx.request.params.id, 10);

  const event = await updateEvent({ id, ...ctx.request.body.event });

  ctx.assert(event, 400, `No event with id ${id}`);

  ctx.body = { message: 'OK' };
}

async function remove(ctx) {
  const id = parseInt(ctx.request.params.id, 10);

  await deleteEvent(id);

  ctx.body = { message: 'OK' };
}

async function addAttend(ctx) {
  const { id: userId } = ctx.state.authPayload;

  const eventId = parseInt(ctx.request.params.id, 10);
  await addEventAttend({ user_id: userId, event_id: eventId });

  ctx.body = { message: 'OK' };
}

module.exports = { create, getOne, getApproved, getNow, update, remove, addAttend };
