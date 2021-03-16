const {
  server: { JSON_ERROR_NAME: ERROR },
} = require('../../config');

function setErrorResponse(incomingError, ctx) {
  ctx.status = incomingError.status || 500;

  if (incomingError.name === 'DatabaseError') ctx.status = 400;

  const defaultMessage = ctx.response.message;
  const errMessage =
    ctx.status < 500 ? `${defaultMessage}: ${incomingError.message}` : defaultMessage;

  if (ctx.accepts('json')) {
    ctx.body = { [ERROR]: errMessage };
  } else {
    ctx.body = errMessage;
  }
}

async function handler(ctx, next) {
  try {
    await next();

    if (ctx.status === 404) setErrorResponse({ status: 404, message: ctx.response.message }, ctx);
  } catch (err) {
    setErrorResponse(err, ctx);

    ctx.app.emit('error', err, ctx);
  }
}

function errorHandler() {
  return handler;
}

module.exports = errorHandler;
