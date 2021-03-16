const Knex = require('knex');
const log = require('../../utils/logger')(__filename);

const name = 'knex';

module.exports = (config) => {
  const knex = new Knex(config);

  return {
    testConnection: async () => {
      try {
        log.info(`Hello from ${name} testConnection`);
        await knex.raw('SELECT NOW();');
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    close: async () => {
      log.info(`Closing ${name} DB wrapper`);
      // no close for knex
    },
  };
};
