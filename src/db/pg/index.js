const { Pool } = require('pg');
const users = require('./users');
const organizations = require('./organizations');
const places = require('./places');
const photos = require('./photos');
const log = require('../../utils/logger')(__filename);

const name = 'pg';

module.exports = (config) => {
  const client = new Pool(config);
  const {
    createUser,
    getUser,
    checkUser,
    getUserCredentials,
    getUserToken,
    updateUser,
    deleteUser,
  } = users(client);
  const {
    createOrganization,
    getOrganizations,
    updateOrganization,
    deleteOrganization,
  } = organizations(client);
  const { createPlace, getPlace, getPlaces, updatePlace, deletePlace } = places(client);
  const { addPhotos, getPhotos, deletePhotos } = photos(client);

  return {
    testConnection: async () => {
      try {
        log.info(`Hello from ${name} testConnection`);
        await client.query('SELECT NOW();');
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    close: async () => {
      log.info(`Closing ${name} DB wrapper`);
      client.end();
    },

    createUser,
    getUser,
    checkUser,
    getUserCredentials,
    getUserToken,
    updateUser,
    deleteUser,

    createOrganization,
    getOrganizations,
    updateOrganization,
    deleteOrganization,

    createPlace,
    getPlace,
    getPlaces,
    updatePlace,
    deletePlace,

    addPhotos,
    getPhotos,
    deletePhotos,
  };
};
