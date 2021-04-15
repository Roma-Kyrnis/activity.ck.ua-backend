const { getUserToken } = require('../../db');
const {
  authorizationTokens: { verifyAccessToken, verifyRefreshToken },
  hash,
} = require('../../utils');
const {
  ROLES: { EVERY, MODERATOR },
} = require('../../config');

const DEFAULT_USER_ID = 1; // CHANGE to truly user id from JWT token

function isRolePermissible(roles, role) {
  const isModerator = role === MODERATOR;
  const isPermissible = roles.find((accessibleRole) => accessibleRole === role);

  if (isModerator || isPermissible) {
    return true;
  }

  return false;
}

function getToken(ctx) {
  const { authorization } = ctx.headers;
  if (authorization) {
    return authorization.split(' ')[1];
  }
  return false;
}

function access(roles = []) {
  return async (ctx, next) => {
    try {
      // let data = { role: EVERY };

      // const token = getToken(ctx);
      // if (token) {
      //   data = await verifyAccessToken(token);
      // }

      // ctx.assert(isRolePermissible(roles, data.role), 401, `Access denied`);

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
      const token = getToken(ctx);
      const payload = await verifyRefreshToken(token);

      const { refresh_token: userToken } = await getUserToken(payload.id);
      ctx.assert(userToken, 401, 'Incorrect user`s token');

      const isUserToken = hash.compare(hash.create(token), userToken);
      ctx.assert(isUserToken, 401, 'Token deprecated');

      ctx.state.authPayload = payload;

      return next();
    } catch (err) {
      return ctx.throw(403, err);
    }
  };
}

module.exports = { access, refresh };
