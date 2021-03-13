require('dotenv').config();

const fatal = require('../utils/fatalError')(__filename);

const config = {
  server: {
    PORT: Number(process.env.PORT) || 3012,
    HOST: process.env.HOST || 'localhost',
    prefix: {
      API_V1: '/api/v1',
      PLACES: '/places',
    },
    NODE_ENV: process.env.NODE_ENV,
    MORGAN_FORMAT: 'dev',
  },
  places: {
    default: {
      LIMIT: 5,
      PAGE: 1,
    }
  },
  secretKey: process.env.ACCESS_TOKEN_SECRET || fatal('ACCESS_TOKEN_SECRET is not defined'),
  db: {
    defaultType: process.env.DB_WRAPPER_TYPE || 'pg',
    config: {
      knex: {
        client: 'postgresql',
        connection: {
          user: process.env.POSTGRES_USER || fatal('POSTGRES_USER is not defined'),
          host: process.env.POSTGRES_HOST || fatal('DB_HOST is not defined'),
          port: Number(process.env.POSTGRES_PORT) || fatal('DB_PORT is not defined'),
          database: process.env.POSTGRES_DB || fatal('POSTGRES_DB is not defined'),
          password: process.env.POSTGRES_PASSWORD || fatal('POSTGRES_PASSWORD is not defined'),
        },
        pool: {
          min: 2,
          max: 10,
        },
        debug: true,
      },

      pg: {
        user: process.env.POSTGRES_USER || fatal('POSTGRES_USER is not defined'),
        host: process.env.POSTGRES_HOST || fatal('DB_HOST is not defined'),
        port: Number(process.env.POSTGRES_PORT) || fatal('DB_PORT is not defined'),
        database: process.env.POSTGRES_DB || fatal('POSTGRES_DB is not defined'),
        password: process.env.POSTGRES_PASSWORD || fatal('POSTGRES_PASSWORD is not defined'),
      },
    },
  },
};

module.exports = config;
