const { Joi } = require('koa-joi-router');

const create = {
  body: Joi.object({
    organization_id: Joi.number().min(0),
    organization: Joi.object({
      name: Joi.string().min(3).max(255).required(),
      phones: Joi.array()
        .items(
          Joi.string()
            .pattern(/^\+380\d{9}$/)
            .required(),
        )
        .required(),
      email: Joi.string().email().required(),
    }),
    place: Joi.object({
      name: Joi.string().min(3).max(255).required(),
      category_id: Joi.string().min(3).max(255).required(), // change to ENUM
      type_id: Joi.string().pattern(/^([a-z]|-)+$/),
      address: Joi.string().min(3).max(255).required(),
      phones: Joi.array()
        .items(
          Joi.string()
            .pattern(/^\+380\d{9}$/)
            .required(),
        )
        .required(),
      website: Joi.string().uri({ allowRelative: true }),
      work_time: Joi.object()
        .min(1)
        .pattern(
          /^(sat|mon|tue|wed|thu|fri|sun)$/,
          Joi.object({
            start: Joi.string()
              .pattern(/^\d{1,2}:\d{2}$/)
              .required(),
            end: Joi.string()
              .pattern(/^\d{1,2}:\d{2}$/)
              .required(),
          }).required(),
        )
        .required(),
      accessibility: Joi.boolean().required(),
      dog_friendly: Joi.boolean().required(),
      child_friendly: Joi.boolean().required(),
      description: Joi.string().min(20).required(),
      main_photo: Joi.string().uri().required(),
    }),
    photos: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().required(),
        // author_name: Joi.string().min(3).max(255),
        // author_link: Joi.string().uri(),
      }).required(),
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
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  /* output: {
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
              // author_name: Joi.string().min(3).max(255),
              // author_link: Joi.string().uri(),
            }),
          ),
          // website: Joi.string().uri({ allowRelative: true }),
          work_time: Joi.object()
            .min(1)
            .pattern(
              /^(sat|mon|tue|wed|thu|fri|sun)$/,
              Joi.object({
                start: Joi.string()
                  .pattern(/^\d{1,2}:\d{2}$/)
                  .required(),
                end: Joi.string()
                  .pattern(/^\d{1,2}:\d{2}$/)
                  .required(),
              }).required(),
            ),
          accessibility: Joi.boolean(),
          dog_friendly: Joi.boolean(),
          child_friendly: Joi.boolean(),
          description: Joi.string().min(20),
          rating: Joi.number().min(0),
        }),
      },
    },
    400: {
      body: {
        message: 'No place with id - 1',
      },
    },
  }, */
};

const getAll = {
  query: Joi.object({
    category_id: Joi.string(),
    type_id: Joi.string().pattern(/^([a-z]|-)+$/),
    accessibility: Joi.boolean().truthy('true').falsy('false'),
    dog_friendly: Joi.boolean().truthy('true').falsy('false'),
    child_friendly: Joi.boolean().truthy('true').falsy('false'),
    _page: Joi.string().pattern(/^[1-9]\d*$/),
    _limit: Joi.string().pattern(/^[1-9]\d*$/),
  }).xor('category_id', 'type_id'),
  /* output: {
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
            // website: Joi.string().uri({ allowRelative: true }),
            main_photo: Joi.string().uri(),
            work_time: Joi.object()
              .min(1)
              .pattern(
                /^(sat|mon|tue|wed|thu|fri|sun)$/,
                Joi.object({
                  start: Joi.string()
                    .pattern(/^\d{1,2}:\d{2}$/)
                    .required(),
                  end: Joi.string()
                    .pattern(/^\d{1,2}:\d{2}$/)
                    .required(),
                }).required(),
              ),
            rating: Joi.number().min(0),
          }),
        ),
        _total: Joi.number().min(0),
        _totalPages: Joi.number().min(0),
      },
    },
  }, */
};

const update = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  body: Joi.object({
    organization_id: Joi.number().min(0),
    place: Joi.object({
      name: Joi.string().min(3).max(255),
      category_id: Joi.string().min(3).max(255), // change to ENUM
      type_id: Joi.string().pattern(/^([a-z]|-)+$/),
      address: Joi.string().min(3).max(255),
      phones: Joi.array().items(
        Joi.string()
          .pattern(/^\+380\d{9}$/)
          .required(),
      ),
      website: Joi.string().uri({ allowRelative: true }),
      work_time: Joi.object()
        .min(1)
        .pattern(
          /^(sat|mon|tue|wed|thu|fri|sun)$/,
          Joi.object({
            start: Joi.string()
              .pattern(/^\d{1,2}:\d{2}$/)
              .required(),
            end: Joi.string()
              .pattern(/^\d{1,2}:\d{2}$/)
              .required(),
          }).required(),
        ),
      accessibility: Joi.boolean(),
      dog_friendly: Joi.boolean(),
      child_friendly: Joi.boolean(),
      description: Joi.string().min(20),
      main_photo: Joi.string().uri(),
      moderated: Joi.boolean(),
    }),
    // photos: Joi.array().items(
    //   Joi.object({
    //     url: Joi.string().uri().required(),
    //     author_name: Joi.string().min(3).max(255),
    //     author_link: Joi.string().uri(),
    //   }).required(),
    // ),
  }).or(
    'place.name',
    'place.category_id',
    'place.typeId',
    'place.address',
    'place.phones',
    'place.website',
    'place.work_time',
    'place.accessibility',
    'place.dog_friendly',
    'place.child_friendly',
    'place.description',
    'place.main_photo',
    'place.moderated',
  ),
  type: 'json',
  output: {
    200: {
      body: {
        message: 'OK',
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

module.exports = { create, getOne, getAll, update, remove };
