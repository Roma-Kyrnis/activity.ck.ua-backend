const { Joi } = require('koa-joi-router');

const create = {
  body: Joi.object({
    organization_id: Joi.number().min(0),
    event: Joi.object({
      name: Joi.string().min(3).max(255).required(),
      address: Joi.string().min(3).max(255).required(),
      phones: Joi.array()
        .items(Joi.string().pattern(/^\+380\d{9}$/))
        .default([]),
      website: Joi.alternatives(Joi.allow(null), Joi.string().uri({ allowRelative: true })),
      // work_time: Joi.object()
      //   .min(1)
      //   .pattern(
      //     /^(sat|mon|tue|wed|thu|fri|sun)$/,
      //     Joi.object({
      //       start: Joi.string()
      //         .pattern(/^\d{1,2}:\d{2}$/)
      //         .required(),
      //       end: Joi.string()
      //         .pattern(/^\d{1,2}:\d{2}$/)
      //         .required(),
      //     }).required(),
      //   )
      //   .required(),
      accessibility: Joi.boolean().required(),
      dog_friendly: Joi.boolean().required(),
      child_friendly: Joi.boolean().required(),
      description: Joi.string().min(20).required(),
      main_photo: Joi.string().uri().required(),
      program: Joi.string().required(),
      price: Joi.number().min(0),
    }),
    photos: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          author_name: Joi.string().min(3).max(255),
          author_link: Joi.string().uri(),
        }).required(),
      )
      .required(),
  }),
  type: 'json',
};

const getOne = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const getApproved = {
  query: Joi.object({
    accessibility: Joi.boolean().truthy('true').falsy('false'),
    dog_friendly: Joi.boolean().truthy('true').falsy('false'),
    child_friendly: Joi.boolean().truthy('true').falsy('false'),
    _page: Joi.string().pattern(/^[1-9]\d*$/),
    _limit: Joi.string().pattern(/^[1-9]\d*$/),
  }).xor('category_id', 'type_id'),
};

const update = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  body: Joi.object({
    organization_id: Joi.number().min(0),
    event: Joi.object({
      name: Joi.string().min(3).max(255).required(),
      address: Joi.string().min(3).max(255).required(),
      phones: Joi.array()
        .items(Joi.string().pattern(/^\+380\d{9}$/))
        .default([]),
      website: Joi.alternatives(Joi.allow(null), Joi.string().uri({ allowRelative: true })),
      // work_time: Joi.object()
      //   .min(1)
      //   .pattern(
      //     /^(sat|mon|tue|wed|thu|fri|sun)$/,
      //     Joi.object({
      //       start: Joi.string()
      //         .pattern(/^\d{1,2}:\d{2}$/)
      //         .required(),
      //       end: Joi.string()
      //         .pattern(/^\d{1,2}:\d{2}$/)
      //         .required(),
      //     }).required(),
      //   )
      //   .required(),
      accessibility: Joi.boolean().required(),
      dog_friendly: Joi.boolean().required(),
      child_friendly: Joi.boolean().required(),
      description: Joi.string().min(20).required(),
      main_photo: Joi.string().uri().required(),
      program: Joi.string().required(),
      price: Joi.number().min(0),
    }),
    // photos: Joi.array().items(
    //   Joi.object({
    //     url: Joi.string().uri().required(),
    //     author_name: Joi.string().min(3).max(255),
    //     author_link: Joi.string().uri(),
    //   }).required(),
    // ),
  }).or(
    'event.name',
    'event.address',
    'event.phones',
    // 'event.website',
    // 'event.work_time',
    'event.accessibility',
    'event.dog_friendly',
    'event.child_friendly',
    'event.description',
    'event.main_photo',
    'event.moderated',
    'event.program',
    'event.price',
  ),
  type: 'json',
};

const remove = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

module.exports = { create, getOne, getApproved, update, remove };
