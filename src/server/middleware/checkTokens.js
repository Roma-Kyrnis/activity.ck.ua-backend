const { getUserCredentials } = require('../../db');
const {
  authorizationTokens: { verifyAccessToken, verifyRefreshToken },
  hash,
} = require('../../utils');

function getAuthToken(ctx, next) {
  const token = ctx.headers.authorization.split(' ')[1];
  ctx.state.token = token;

  return next();
}

async function checkAccessToken(ctx, next) {
  try {
    const data = await verifyAccessToken(ctx.state.token);

    ctx.state.authPayload = data;

    return next();
  } catch (err) {
    return ctx.throw(403, err);
  }
}

async function checkRefreshToken(ctx, next) {
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
}

const access = [getAuthToken, checkAccessToken];
const refresh = [getAuthToken, checkRefreshToken];

module.exports = { access, refresh };
