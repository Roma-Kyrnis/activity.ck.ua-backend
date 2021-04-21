const {
  errors: { DATABASE },
} = require('../config');

class DatabaseError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }

    this.name = DATABASE;
  }
}

function checkError(err) {
  if (err.constraint === 'users_email_unk') {
    return new DatabaseError('ERROR: A user with the same email is already registered!');
  }

  if (err.constraint === 'organizations_email_unk') {
    return new DatabaseError('ERROR: An organization with the same email is already registered!');
  }

  if (err.constraint === 'organizations_name_unk') {
    return new DatabaseError('ERROR: An organization with the same name is already registered!');
  }

  if (err.constraint === 'visited_places_pkey') {
    return new DatabaseError('ERROR: A place with this ID already visited!');
  }

  if (err.constraint === 'favorite_places_pkey') {
    return new DatabaseError('ERROR: A place with this ID already favorite!');
  }

  if (err.constraint === 'scheduled_events_pkey') {
    return new DatabaseError('ERROR: Event with this ID already scheduled!');
  }

  if (err.constraint === 'reviews_pkey') {
    return new DatabaseError('ERROR: A place with this ID already reviewed!');
  }

  // very unlikely errors:
  if (err.message === 'division by zero') {
    return new DatabaseError('ERROR: A places with this category_id does not exist!');
  }

  if (err.constraint === 'places_fk0') {
    return new DatabaseError('ERROR: An organization with this ID does not exist!');
  }

  if (err.constraint === 'events_fk0') {
    return new DatabaseError('ERROR: A place with this ID does not exist!');
  }

  if (err.constraint === 'visited_places_fk0') {
    return new DatabaseError('ERROR: A place with this ID does not exist!');
  }

  if (err.constraint === 'favorite_places_fk0') {
    return new DatabaseError('ERROR: A place with this ID does not exist!');
  }

  if (err.constraint === 'scheduled_events_fk0') {
    return new DatabaseError('ERROR: Event with this ID does not exist!');
  }

  if (err.constraint === 'reviews_fk0') {
    return new DatabaseError('ERROR: A place with this ID does not exist!');
  }

  return err;
}

module.exports = { checkError, DatabaseError };
