const { createUser, updateUser, getUserCredentials } = require('../../../db');
const { hash, authorizationTokens } = require('../../../utils');

function getCredentialsString(body) {
  return `${body.email}${body.password}`;
}

async function registration(ctx) {
  const passwordHash = hash.create(getCredentialsString(ctx.request.body));
  const user = {
    name: ctx.request.body.name,
    avatar: ctx.request.body.avatar,
    email: ctx.request.body.email,
    passwordHash,
  };
  const userDB = await createUser(user);

  ctx.body = {
    user_id: userDB.id,
  };
}

async function login(ctx) {
  const user = await getUserCredentials(ctx.request.body.email);
  ctx.assert(user, 401, 'Incorrect credentials');
  const passwordHash = hash.create(getCredentialsString(ctx.request.body));
  const isCompared = hash.compare(passwordHash, user.password_hash);
  ctx.assert(isCompared, 401, 'Incorrect credentials');

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const tokens = {
    access_token: await authorizationTokens.generateAccessToken(payload),
    refresh_token: await authorizationTokens.generateRefreshToken(payload),
  };

  const hashedRefresh = hash.create(tokens.refresh_token);
  await updateUser({ id: user.id, refresh_token: hashedRefresh });

  ctx.body = tokens;
}

async function refresh(ctx) {
  const { authPayload } = ctx.state;

  const payload = {
    id: authPayload.id,
    email: authPayload.email,
    role: authPayload.role,
  };

  const tokens = {
    access_token: await authorizationTokens.generateAccessToken(payload),
    refresh_token: await authorizationTokens.generateRefreshToken(payload),
  };

  const hashedRefresh = hash.create(tokens.refresh_token);
  await updateUser({ id: payload.id, refresh_token: hashedRefresh });

  ctx.body = tokens;
}

async function logout(ctx) {
  const { authPayload } = ctx.state;

  await updateUser({ id: authPayload.id, refresh_token: null });

  ctx.body = { message: 'OK' };
}

module.exports = { registration, login, refresh, logout };
