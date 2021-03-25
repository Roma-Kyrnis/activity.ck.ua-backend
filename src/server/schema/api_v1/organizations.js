const { Joi } = require('koa-joi-router');

const getAll = {
  output: {
    200: {
      body: {
        organizations: Joi.array().items(
          Joi.object({
            id: Joi.number().required(),
            name: Joi.string().min(3).max(255).required(),
            phones: Joi.array()
              .items(
                Joi.string()
                  .pattern(/^\+380\d{9}$/)
                  .required(),
              )
              .required(),
            email: Joi.string().email().required(),
            moderated: Joi.boolean().required(),
          }),
        ),
      },
    },
  },
};

module.exports = { getAll };
