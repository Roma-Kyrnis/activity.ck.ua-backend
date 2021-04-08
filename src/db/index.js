const {
  db: { config, defaultType },
} = require('../config');
const fatal = require('../utils/fatalError')(__filename);

const log = require('../utils/logger')(__filename);

const db = {};
let type = defaultType;

const funcWrapper = (func) =>
  typeof func === 'function'
    ? func
    : fatal(`Cannot find ${func.name} function for current DB wrapper`);

const init = async () => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const [k, v] of Object.entries(config)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const wrapper = require(`./${k}`)(v);
      // eslint-disable-next-line no-await-in-loop
      await wrapper.testConnection();
      log.info(`DB wrapper for ${k} initiated`);
      db[k] = wrapper;
    }
  } catch (err) {
    const error = err.message || err;
    log.error(error);
    fatal(error);
  }
};

const end = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [k, v] of Object.entries(db)) {
    // eslint-disable-next-line no-await-in-loop
    await v.close();
    log.info(`DB wrapper for ${k} was closed`);
  }
};

const setType = (t) => {
  if (!t || !db[t]) {
    log.warn('Cannot find provided DB type!');
    return false;
  }
  type = t;
  log.info(`The DB type has been changed to ${t}`);
  return true;
};

const getType = () => type;

const dbWrapper = (t) => db[t] || db[type];

module.exports = {
  init,
  end,
  setType,
  getType,
  dbWrapper,
  // ----------------

  testConnection: async () => funcWrapper(dbWrapper().testConnection)(),
  close: async () => funcWrapper(dbWrapper().close)(),

  createUser: async (user) => funcWrapper(dbWrapper().createUser)(user),
  getUser: async (id) => funcWrapper(dbWrapper().getUser)(id),
  checkUser: async (email) => funcWrapper(dbWrapper().checkUser)(email),
  getUserCredentials: async (email) => funcWrapper(dbWrapper().getUserCredentials)(email),
  getUserToken: async (id) => funcWrapper(dbWrapper().getUserToken)(id),
  updateUser: async (user) => funcWrapper(dbWrapper().updateUser)(user),
  deleteUser: async (id) => funcWrapper(dbWrapper().deleteUser)(id),

  createOrganization: async (organization) =>
    funcWrapper(dbWrapper().createOrganization)(organization),
  getOrganizations: async (isModerated) => funcWrapper(dbWrapper().getOrganizations)(isModerated),
  updateOrganization: async (organization) =>
    funcWrapper(dbWrapper().updateOrganization)(organization),
  deleteOrganization: async (id) => funcWrapper(dbWrapper().deleteOrganization)(id),

  createPlace: async (place) => funcWrapper(dbWrapper().createPlace)(place),
  getPlace: async (id) => funcWrapper(dbWrapper().getPlace)(id),
  getPlaces: async (filters, limit, page) =>
    funcWrapper(dbWrapper().getPlaces)(filters, limit, page),
  updatePlace: async (place) => funcWrapper(dbWrapper().updatePlace)(place),
  deletePlace: async (id) => funcWrapper(dbWrapper().deletePlace)(id),

  addPhotos: async (photos, id, nameId) => funcWrapper(dbWrapper().addPhotos)(photos, id, nameId),
  getPhotos: async (id, nameId) => funcWrapper(dbWrapper().getPhotos)(id, nameId),
  deletePhotos: async (ids) => funcWrapper(dbWrapper().deletePhotos)(ids),

  createEvent: async (event) => funcWrapper(dbWrapper().createEvent)(event),
  getEvent: async (id) => funcWrapper(dbWrapper().getEvent)(id),
  getEvents: async (startTime, limit, page, filters) =>
    funcWrapper(dbWrapper().getEvents)(startTime, limit, page, filters),
  getCurrentEvents: async (limit, page, filters) =>
    funcWrapper(dbWrapper().getCurrentEvents)(limit, page, filters),
  isUserEvent: async (userId, eventId) => funcWrapper(dbWrapper().isUserEvent)(userId, eventId),
  getUserEvents: async (userId, limit, page) =>
    funcWrapper(dbWrapper().getUserEvents)(userId, limit, page),
  getPlaceEvents: async (placeId, limit, page) =>
    funcWrapper(dbWrapper().getPlaceEvents)(placeId, limit, page),
  updateEvent: async (event) => funcWrapper(dbWrapper().updateEvent)(event),
  deleteEvent: async (id) => funcWrapper(dbWrapper().deleteEvent)(id),
};
