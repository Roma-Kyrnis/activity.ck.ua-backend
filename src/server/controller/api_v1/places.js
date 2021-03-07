const log = require('../../../utils/logger')(__filename);

const PLACES = [];

async function createOrganization(organization) {
  console.log({ organization });
  const id = '13423nognw';
  return id;
}

async function savePhotos(placeId, photos) {
  console.log({ photos, placeId });
  const ids = [1, 2, 3];
  return ids;
}

async function createPlaceDB(place) {
  PLACES.push(place);
  const id = PLACES.length - 1;
  return { id };
}

async function getPlacesDB(id) {
  if (id) return PLACES[id];
  return PLACES;
}

async function create(ctx) {
  const organizationId =
    ctx.request.body.organization_id || (await createOrganization(ctx.request.body.organization));

  const dataPlace = {
    ...ctx.request.body.place,
    organization_id: organizationId,
  };

  const { id: placeId } = await createPlaceDB(dataPlace);

  await savePhotos(placeId, ctx.request.body.photos);

  ctx.body = { message: 'OK' };
}

async function getOne(ctx) {
  const id = parseInt(ctx.request.params.id, 10);

  try {
    const place = await getPlacesDB(id);

    ctx.body = { place };
  } catch (err) {
    log.error({ err });
    ctx.throw(400, `No place with id - ${id}`);
  }
}

async function getAll(ctx) {
  const places = await getPlacesDB();

  ctx.body = { places };
}

module.exports = { create, getOne, getAll };
