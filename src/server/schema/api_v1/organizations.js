const { Joi } = require('koa-joi-router');

const getAll = {
  output: {
    200: {
      body: {
        approvedOrganizations: Joi.array().items(
          Joi.object({
            id: Joi.number().required(),
            name: Joi.string().min(3).max(255).required(),
          }),
        ),
        proposedOrganizations: Joi.array().items(
          Joi.object({
            id: Joi.number().required(),
            name: Joi.string().min(3).max(255).required(),
          }),
        ),
      },
    },
  },
};

module.exports = { getAll };
