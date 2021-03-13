const log = require('../../utils/logger')(__filename);
const {
  server: { NODE_ENV },
} = require('../../config');

function errorHandler(incomingError, ctx) {
  const error = incomingError;

  log.debug(error.message || error);

  let errMessage = { message: 'Internal server error!' };
  if (NODE_ENV === 'development') {
    errMessage.message = error.message;
    errMessage.stack = error.stack;
    errMessage.body = error;
    ctx.status = 400;
  } else if (error.status && parseInt(error.status, 10) !== 500 && error.message) {
    ctx.status = error.status;
    errMessage = { message: error.message };
  } else {
    ctx.status = 500;
  }

  ctx.body = errMessage;
}

module.exports = errorHandler;
