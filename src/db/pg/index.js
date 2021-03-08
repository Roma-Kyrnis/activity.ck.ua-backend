const { Pool } = require('pg');

const places = require('./places');

const log = require('../../utils/logger')(__filename);

module.exports = (config) => {
  const client = new Pool(config);
  const { createPlace, getPlace, getPlaces, updatePlace, deletePlace } = places(client);

  return {
    testConnection: async () => {
      try {
        log.info(`hello from pg testConnection`);
        await client.query('SELECT NOW();');
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    close: async () => {
      log.info(`Closing pg DB wrapper`);
      client.end();
    },

    createPlace,
    getPlace,
    getPlaces,
    updatePlace,
    deletePlace,
  };
};
