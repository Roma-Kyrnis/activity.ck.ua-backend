class DatabaseError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }

    this.name = 'DatabaseError';
  }
}

function checkError(err) {
  if (err.constraint === 'users_email_unk') {
    return new DatabaseError('ERROR: A user with the same email is already registered!');
  }

  if (err.constraint === 'organizations_email_unk') {
    return new DatabaseError('ERROR: A organization with the same email is already registered!');
  }

  if (err.constraint === 'organizations_name_unk') {
    return new DatabaseError('ERROR: A organization with the same name is already registered!');
  }

  return err;
}

module.exports = { checkError, DatabaseError };
