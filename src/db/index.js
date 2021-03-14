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
  getUser: async (email) => funcWrapper(dbWrapper().getUser)(email),
  checkUser: async (email) => funcWrapper(dbWrapper().checkUser)(email),
  getUserCredentials: async (email) => funcWrapper(dbWrapper().getUserCredentials)(email),
  updateUser: async (user) => funcWrapper(dbWrapper().updateUser)(user),
  deleteUser: async (id) => funcWrapper(dbWrapper().deleteUser)(id),

  createOrganization: async (organization) =>
    funcWrapper(dbWrapper().createOrganization)(organization),
  getOrganizations: async () => funcWrapper(dbWrapper().getOrganizations)(),
  updateOrganization: async (organization) =>
    funcWrapper(dbWrapper().updateOrganization)(organization),
  deleteOrganization: async (id) => funcWrapper(dbWrapper().deleteOrganization)(id),

  createPlace: async (place) => funcWrapper(dbWrapper().createPlace)(place),
  getPlace: async (id) => funcWrapper(dbWrapper().getPlace)(id),
  getPlaces: async (filters, limit, page) =>
    funcWrapper(dbWrapper().getPlaces)(filters, limit, page),
  updatePlace: async (place) => funcWrapper(dbWrapper().updatePlace)(place),
  deletePlace: async (id) => funcWrapper(dbWrapper().deletePlace)(id),
};
