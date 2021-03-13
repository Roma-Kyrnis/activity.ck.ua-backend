const { Joi } = require('koa-joi-router');

const create = {
  body: Joi.object({
    organization_id: Joi.number().min(0),
    organization: Joi.object({
      name: Joi.string().min(3).max(255),
      phones: Joi.array().items(Joi.string().pattern(/^\+380\d{9}$/)),
      email: Joi.string().email(),
    }),
    place: Joi.object({
      name: Joi.string().min(3).max(255),
      category_id: Joi.string().min(3).max(255), // change to ENUM
      type_id: Joi.string().min(3).max(255),
      address: Joi.string().min(3).max(255),
      phones: Joi.array().items(Joi.string().pattern(/^\+380\d{9}$/)),
      website: Joi.string().uri({ allowRelative: true }),
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
        place: Joi.object({
          id: Joi.number().min(0),
          organization_id: Joi.number().min(0),
          name: Joi.string().min(3).max(255),
          address: Joi.string().min(3).max(255),
          phones: Joi.array().items(Joi.string().pattern(/^\+380\d{9}$/)),
          photos: Joi.array().items(
            Joi.object({
              id: Joi.number().min(0),
              url: Joi.string().uri(),
              author_name: Joi.string().min(3).max(255),
              author_link: Joi.string().uri(),
            }),
          ),
          website: Joi.string().uri({ allowRelative: true }),
          work_time: Joi.object().unknown(), // Just for test --- NEED TO BE CHANGED
          accessibility: Joi.boolean(),
          dog_friendly: Joi.boolean(),
          child_friendly: Joi.boolean(),
          description: Joi.string().min(20), // without max test size .max(511)
          rating: Joi.string(),
        }),
      },
    },
  },
};

const getAll = {
  query: Joi.object({
    category_id: Joi.string(),
    type_id: Joi.string().pattern(/^([a-z]|-)+$/),
    accessibility: Joi.string().pattern(/^true|false$/),
    dog_friendly: Joi.string().pattern(/^true|false$/),
    child_friendly: Joi.string().pattern(/^true|false$/),
    _page: Joi.string().pattern(/^[1-9]\d*$/),
    _limit: Joi.string().pattern(/^[1-9]\d*$/),
  }), // .xor('category_id', 'type_id')
  output: {
    200: {
      body: {
        message: 'OK',
        places: Joi.array().items(
          Joi.object({
            id: Joi.number().min(0),
            // organization_id: Joi.number().min(0),
            name: Joi.string().min(3).max(255),
            address: Joi.string().min(3).max(255),
            phones: Joi.array().items(Joi.string().pattern(/^\+380\d{9}$/)),
            website: Joi.string().uri({ allowRelative: true }),
            main_photo: Joi.string().uri(),
            work_time: Joi.object().unknown(), // Just for test --- NEED TO BE CHANGED
            // accessibility: Joi.boolean(),
            // dog_friendly: Joi.boolean(),
            // child_friendly: Joi.boolean(),
            description: Joi.string().min(20), // without max test size .max(511)
            rating: Joi.string(),
          }),
        ),
        _total: Joi.number().min(0),
        _totalPages: Joi.number().min(0),
      },
    },
  },
};

module.exports = { create, getOne, getAll };
