const { getUserCredentials } = require('../../db');
const {
  authorizationTokens: { verifyAccessToken, verifyRefreshToken },
  hash,
} = require('../../utils');

function getAuthToken() {
  return (ctx, next) => {
    const token = ctx.headers.authorization.split(' ')[1];
    ctx.state.token = token;

    return next();
  };
}

function checkAccessToken(role) {
  return async (ctx, next) => {
    try {
      const data = await verifyAccessToken(ctx.state.token);

      ctx.assert(data.role === role, 401, 'Access denied for user');

      ctx.state.authPayload = data;

      return next();
    } catch (err) {
      return ctx.throw(403, err);
    }
  };
}

function checkRefreshToken() {
  return async (ctx, next) => {
    try {
      const { token: incomingToken } = ctx.state;
      const data = await verifyRefreshToken(incomingToken);

      const { refresh_token: refreshToken } = await getUserCredentials(data.email);

      ctx.assert(refreshToken, 401, 'Incorrect user`s token');

      const incomingTokenHashed = hash.create(incomingToken);
      const isUserToken = hash.compare(incomingTokenHashed, refreshToken);
      ctx.assert(isUserToken, 401, 'Token deprecated');

      ctx.state.authPayload = data;

      return next();
    } catch (err) {
      return ctx.throw(403, err);
    }
  };
}

function access(role) {
  return [getAuthToken(), checkAccessToken(role)];
}

function refresh() {
  return [getAuthToken(), checkRefreshToken()];
}

module.exports = { access, refresh };
