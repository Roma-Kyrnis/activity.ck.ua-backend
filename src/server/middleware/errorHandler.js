const log = require('../../utils/logger')(__filename);
const {
  server: { NODE_ENV },
} = require('../../config');

function errorHandler(incomingError, ctx) {
  log.debug({ incomingError }, 'Global catch errors');
  log.debug({ type: typeof incomingError });

  const error = incomingError;

  let errMessage = { message: 'Internal server error!' };
  if (error.status && parseInt(error.status, 10) !== 500 && error.message) {
    ctx.status = error.status;
    errMessage = { message: error.message };
  } else {
    ctx.status = 500;
  }

  if (NODE_ENV === 'development') {
    errMessage.stack = error.stack;
    errMessage.body = error;
  }

  ctx.body = errMessage;
}

module.exports = errorHandler;
