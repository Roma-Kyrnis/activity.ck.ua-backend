const { getUserToken } = require('../../db');
const {
  authorizationTokens: { verifyAccessToken, verifyRefreshToken },
  hash,
} = require('../../utils');
const {
  ROLES: { EVERY, MODERATOR },
} = require('../../config');

const DEFAULT_USER_ID = 1; // CHANGE to truly user id from JWT token

function checkRole(roles) {
  return (role) => {
    const isModerator = role === MODERATOR;
    if (isModerator) {
      return role;
    }

    const isClientRolePermissible = roles.find((clientRole) => clientRole === role);
    if (isClientRolePermissible) {
      return role;
    }

    return false;
  };
}

function getToken(ctx) {
  const { authorization } = ctx.headers;
  if (authorization) {
    return authorization.split(' ')[1];
  }
  return false;
}

function access(roles = []) {
  const isAccess = checkRole(roles);

  return async (ctx, next) => {
    try {
      // let data = {};

      // const token = getToken(ctx);

      // if (token || !isAccess(EVERY)) {
      //   data = await verifyAccessToken(token);
      //   ctx.assert(isAccess(data.role), 401, `Access denied for ${data.role}`);
      // }

      // ctx.state.authPayload = data;

      // ------- Temporary: ------- Because authorization does not work on frontend
      ctx.state.authPayload = {
        id: DEFAULT_USER_ID,
        role: MODERATOR,
      };

      return next();
    } catch (err) {
      return ctx.throw(403, err);
    }
  };
}

function refresh() {
  return async (ctx, next) => {
    try {
      const incomingToken = getToken(ctx);
      const data = await verifyRefreshToken(incomingToken);

      const { refresh_token: refreshToken } = await getUserToken(data.id);

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

module.exports = { access, refresh };
