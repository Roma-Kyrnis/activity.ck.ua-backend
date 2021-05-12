const { searchPlaces, searchEvents } = require('../../../db');
const { getSearchParams } = require('./utils');

async function places(ctx) {
  const { name, limit, page } = getSearchParams(ctx.request.query);

  const response = await searchPlaces(name, limit, page);

  ctx.body = response;
}

async function events(ctx) {
  const { name, limit, page } = getSearchParams(ctx.request.query);

  const response = await searchEvents(name, limit, page);

  ctx.body = response;
}

module.exports = { places, events };
