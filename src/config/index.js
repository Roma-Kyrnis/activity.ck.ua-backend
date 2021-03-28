require('dotenv').config();

const fatal = require('../utils/fatalError')(__filename);

const config = {
  server: {
    PORT: Number(process.env.PORT) || 3012,
    HOST: process.env.HOST || 'localhost',
    prefix: {
      API_V1: '/api/v1',
      AUTH: '/auth',
      PLACES: '/places',
      ORGANIZATIONS: '/organizations',
    },
    NODE_ENV: process.env.NODE_ENV || 'production',
    MORGAN_FORMAT: 'dev',
    JSON_ERROR_NAME: 'error',
    HASH_SECRET: process.env.HASH_SECRET || fatal('No HASH_SECRET'),
    tokens: {
      ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || fatal('No ACCESS_TOKEN_SECRET'),
      ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE || fatal('No ACCESS_TOKEN_LIFE'),
      REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || fatal('No REFRESH_TOKEN_SECRET'),
      REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE || fatal('No REFRESH_TOKEN_LIFE'),
    },
  },
  errors: {
    DATABASE: 'DatabaseError',
  },
  places: {
    default: {
      LIMIT: 5,
      PAGE: 1,
      DAYS: ['sat', 'mon', 'tue', 'wed', 'thu', 'fri', 'sun'],
    },
    schema: {
      PHONE: /^\+380\d{9}$/,
      TIME: /^\d{1,2}:\d{2}$/,
      TYPE_IDS: /^([a-zA-Z]|-)+$/,
    },
  },
  roles: {
    USER: 'user',
    ORGANIZER: 'organizer',
    MODERATOR: 'moderator',
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
  faker: {
    user: {
      PASSWORDS: ['12345678'],
    },
    default: {
      MODERATOR: {
        name: 'moderator',
        avatar: 'https://www.google.com',
        email: 'moderator@tourism.test.com',
        password: '12345678',
      },
      PLACES_SEEDS: 50,
      PARAMS: {
        COUNT: 'count',
        USER: 'user_id',
        ORGANIZATION: 'organization_id',
      },
    },
    USER_ID: 1,
    ORGANIZATION_ID: 1,
    CATEGORY_IDS: [
      'culture',
      'recreation',
      'children',
      'todo_something',
      'history',
      'unique_things',
      'sleeping',
      'inspired_city',
      'gastronomic_adventures',
    ],
    TYPE_IDS: ['', 'hotels', 'sport', 'water', 'coffee', 'fastfood', 'hostels', 'stadium', 'gym'],
    MIN_PHOTO: 1,
    MAX_PHOTO: 10,
  },
};

module.exports = config;
