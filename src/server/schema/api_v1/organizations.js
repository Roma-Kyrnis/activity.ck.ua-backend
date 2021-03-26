const { Joi } = require('koa-joi-router');

const create = {
  body: Joi.object({
    name: Joi.string().min(3).max(255).required(),
    phones: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\+380\d{9}$/)
          .required(),
      )
      .required(),
    email: Joi.string().email().required(),
  }).required(),
  type: 'json',
  output: {
    200: {
      body: {
        message: 'OK',
      },
    },
  },
};

const getProposed = {
  output: {
    200: {
      body: {
        proposedOrganizations: Joi.array()
          .items(
            Joi.object({
              id: Joi.number().required(),
              name: Joi.string().min(3).max(255).required(),
            }),
          )
          .required(),
      },
    },
  },
};

const getAll = {
  output: {
    200: {
      body: {
        approvedOrganizations: Joi.array()
          .items(
            Joi.object({
              id: Joi.number().required(),
              name: Joi.string().min(3).max(255).required(),
            }),
          )
          .required(),
        proposedOrganizations: Joi.array()
          .items(
            Joi.object({
              id: Joi.number().required(),
              name: Joi.string().min(3).max(255).required(),
            }),
          )
          .required(),
      },
    },
  },
};

const update = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  body: Joi.object({
    name: Joi.string().min(3).max(255),
    phones: Joi.array().items(
      Joi.string()
        .pattern(/^\+380\d{9}$/)
        .required(),
    ),
    email: Joi.string().email(),
    moderated: Joi.boolean(),
  }).or('name', 'phones', 'email', 'moderated'),
  type: 'json',
  output: {
    200: {
      body: {
        message: 'OK',
      },
    },
    400: {
      body: {
        error: "Bad Request: Organization with id #id doesn't exist",
      },
    },
  },
};

const remove = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  output: {
    200: {
      body: {
        message: 'OK',
      },
    },
  },
};

module.exports = { create, getProposed, getAll, update, remove };
