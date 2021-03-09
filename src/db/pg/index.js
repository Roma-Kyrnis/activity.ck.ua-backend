const { Pool } = require('pg');
const users = require('./users');
const organizations = require('./organizations');
const places = require('./places');

module.exports = (config) => {
  const client = new Pool(config);
  const { createUser, getUser, getUserCredentials, updateUser, deleteUser } = users(client);
  const {
    createOrganization,
    getOrganizations,
    updateOrganization,
    deleteOrganization,
  } = organizations(client);
  const { createPlace, getPlace, getPlaces, updatePlace, deletePlace } = places(client);

  return {
    testConnection: async () => {
      try {
        console.log(`hello from pg testConnection`);
        await client.query('SELECT NOW();');
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    close: async () => {
      console.log(`INFO: Closing pg DB wrapper`);
      client.end();
    },

    createUser,
    getUser,
    getUserCredentials,
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
  };
};
