const { Joi } = require('koa-joi-router');

const registration = {
  body: Joi.object({
    name: Joi.string()
      .pattern(/^[a-zA-Z]+$/)
      .min(3)
      .max(255)
      .required(),
    avatar: Joi.string().uri().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^\w+$/).min(8).max(255).required(),
  }),
  type: 'json',
  output: {
    200: {
      body: {
        user_id: Joi.number().min(0),
      },
    },
  },
};

const login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^\w+$/).min(8).max(255).required(),
  }),
  type: 'json',
  output: {
    200: {
      body: {
        access_token: Joi.string(),
        refresh_token: Joi.string(),
      },
    },
    401: { body: 'Incorrect credentials' },
  },
};

const refresh = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  200: {
    body: {
      access_token: Joi.string(),
      refresh_token: Joi.string(),
    },
  },
  401: { body: 'Unauthorized' },
};

const logout = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  200: {
    body: {
      message: 'OK',
    },
  },
  401: { body: 'Unauthorized' },
};

module.exports = { registration, login, refresh, logout };
