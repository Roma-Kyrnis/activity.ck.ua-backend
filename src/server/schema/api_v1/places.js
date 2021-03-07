const { Joi } = require('koa-joi-router');

const create = {
  body: Joi.object({
    organization_id: Joi.number().min(0),
    organization: Joi.object({
      name: Joi.string().min(3).max(255),
      phone: Joi.string().pattern(/^\+380\d{9}$/),
      email: Joi.string().email(),
    }),
    place: Joi.object({
      email: Joi.string().email(),
      name: Joi.string().min(3).max(255),
      category_id: Joi.string().min(3).max(255), // change to ENUM
      type_id: Joi.string().min(3).max(255),
      address: Joi.string().min(3).max(255),
      phones: Joi.array().items(Joi.string().pattern(/^\+380\d{9}$/)),
      website: Joi.string().uri(),
      work_time: Joi.object().unknown(), // Just for test --- NEED TO BE CHANGED
      accessibility: Joi.boolean(),
      dog_friendly: Joi.boolean(),
      child_friendly: Joi.boolean(),
      description: Joi.string().min(20), // without max test size .max(511)
      main_photo: Joi.string().uri(),
    }),
    photos: Joi.array().items(
      Joi.object({
        url: Joi.string().uri(),
        author_name: Joi.string().min(3).max(255),
        author_link: Joi.string().uri(),
      }),
    ),
  }).xor('organization_id', 'organization'),
  type: 'json',
  output: {
    200: {
      body: {
        message: 'OK',
      },
    },
  },
};

const getOne = {
  params: Joi.object({
    id: Joi.number().min(0),
  }),
  output: {
    200: {
      body: {
        message: 'OK',
      },
    },
  },
};

const getAll = {
  params: Joi.object({
    id: Joi.number().min(0),
  }),
  output: {
    200: {
      body: {
        message: 'OK',
        places: Joi.array(),
      },
    },
  },
};

module.exports = { create, getOne, getAll };
