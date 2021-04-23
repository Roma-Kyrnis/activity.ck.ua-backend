const { searchPlaces, searchEvents } = require('../../../db');
const { getSearchParams } = require('./utils');

async function global(ctx) {
  const { name, limit, page } = getSearchParams(ctx.request.query);

  const response = {};

  response.places = await searchPlaces(name, limit, page);
  response.events = await searchEvents(name, limit, page);

  return response;
}

async function places(ctx) {
  const { name, limit, page, filters } = getSearchParams(ctx.request.query);

  const response = await searchPlaces(name, limit, page, filters);

  return response;
}

async function events(ctx) {
  const { name, limit, page } = getSearchParams(ctx.request.query);

  const response = await searchEvents(name, limit, page);

  return response;
}

module.exports = { global, places, events };
