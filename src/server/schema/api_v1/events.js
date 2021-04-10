const { Joi } = require('koa-joi-router');

const create = {
  body: Joi.object({
    event: Joi.object({
      place_id: Joi.number().min(1),

      name: Joi.string().min(3).max(255).required(),
      organizer: Joi.string().min(3).required(),
      start_time: Joi.date().required(),
      end_time: Joi.date().required(),
      price: Joi.number().min(0).default(0.0),
      website: Joi.alternatives(Joi.allow(null), Joi.string().uri({ allowRelative: true })),
      phones: Joi.array()
        .items(Joi.string().pattern(/^\+380\d{9}$/))
        .default([]),
      address: Joi.string().min(3).max(255).required(),
      accessibility: Joi.boolean().required(),
      dog_friendly: Joi.boolean().required(),
      child_friendly: Joi.boolean().required(),
      program: Joi.string().required(),
      description: Joi.string().min(20).required(),
      main_photo: Joi.string().uri().required(),
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
    place_id: Joi.string().pattern(/^[1-9]\d*$/),
    start_time: Joi.date(),
    accessibility: Joi.boolean().truthy('true').falsy('false'),
    dog_friendly: Joi.boolean().truthy('true').falsy('false'),
    child_friendly: Joi.boolean().truthy('true').falsy('false'),
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }).xor('place_id', 'start_time'),
};

const getNow = {
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const update = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  body: Joi.object({
    event: Joi.object({
      place_id: Joi.number().min(1),
      name: Joi.string().min(3).max(255),
      organizer: Joi.string().min(3),
      start_time: Joi.date(),
      end_time: Joi.date(),
      price: Joi.number().min(0).default(0.0),
      website: Joi.alternatives(Joi.allow(null), Joi.string().uri({ allowRelative: true })),
      phones: Joi.array()
        .items(Joi.string().pattern(/^\+380\d{9}$/))
        .default([]),
      address: Joi.string().min(3).max(255),
      accessibility: Joi.boolean(),
      dog_friendly: Joi.boolean(),
      child_friendly: Joi.boolean(),
      program: Joi.string(),
      description: Joi.string().min(20),
      main_photo: Joi.string().uri(),
      moderated: Joi.boolean(),
    }),
  }).or(
    'event.place_id',
    'event.name',
    'event.organizer',
    'event.start_time',
    'event.end_time',
    'event.price',
    'event.website',
    'event.phones',
    'event.address',
    'event.accessibility',
    'event.dog_friendly',
    'event.child_friendly',
    'event.program',
    'event.description',
    'event.main_photo',
    'event.moderated',
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

const addAttend = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

module.exports = { create, getOne, getApproved, getNow, update, remove, addAttend };
