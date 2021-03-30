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
      STORAGE: '/storage',
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
  firebase: {
    // config: {
    //   apiKey: process.env.FIREBASE_API_KEY || fatal('No FIREBASE_API_KEY'),
    //   authDomain: process.env.FIREBASE_AUTH_DOMAIN || fatal('No FIREBASE_AUTH_DOMAIN'),
    //   projectId: process.env.FIREBASE_PROJECT_ID || fatal('No FIREBASE_PROJECT_ID'),
    //   storageBucket: process.env.FIREBASE_STORAGE_BUCKET || fatal('No FIREBASE_STORAGE_BUCKET'),
    //   messagingSenderId:
    //     process.env.FIREBASE_MESSAGING_SENDER_ID || fatal('No FIREBASE_MESSAGING_SENDER_ID'),
    //   appId: process.env.FIREBASE_APP_ID || fatal('No FIREBASE_APP_ID'),
    //   measurementId: process.env.FIREBASE_MEASUREMENT_ID || fatal('No FIREBASE_MEASUREMENT_ID'),
    // },
    serviceAccount: {
      type: process.env.FIREBASE_TYPE || fatal('No FIREBASE_TYPE'),
      project_id: process.env.FIREBASE_PROJECT_ID || fatal('No FIREBASE_PROJECT_ID'),
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || fatal('No FIREBASE_PRIVATE_KEY_ID'),
      private_key: process.env.FIREBASE_PRIVATE_KEY || fatal('No FIREBASE_PRIVATE_KEY'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL || fatal('No FIREBASE_CLIENT_EMAIL'),
      client_id: process.env.FIREBASE_CLIENT_ID || fatal('No FIREBASE_CLIENT_ID'),
      auth_uri: process.env.FIREBASE_AUTH_URI || fatal('No FIREBASE_AUTH_URI'),
      token_uri: process.env.FIREBASE_TOKEN_URI || fatal('No FIREBASE_TOKEN_URI'),
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL ||
        fatal('No FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
      client_x509_cert_url:
        process.env.FIREBASE_CLIENT_X509_CERT_URL || fatal('No FIREBASE_CLIENT_X509_CERT_URL'),
    },
  },
  moderator: {
    name: process.env.MODERATOR_NAME || fatal('No MODERATOR_NAME'),
    avatar: process.env.MODERATOR_AVATAR || fatal('No MODERATOR_AVATAR'),
    email: process.env.MODERATOR_EMAIL || fatal('No MODERATOR_EMAIL'),
    password: process.env.MODERATOR_PASSWORD || fatal('No MODERATOR_PASSWORD'),
  },
  faker: {
    userId: 1,
  },
};

module.exports = config;
