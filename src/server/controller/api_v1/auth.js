const { nanoid } = require('nanoid');
const querystring = require('querystring');

const { createUser, updateUser, getUserCredentials } = require('../../../db');
const { hash, authorizationTokens } = require('../../../utils');
const { mail } = require('../../../lib/api_v1');
const { AUTH } = require('../../../config');

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

async function forgotPassword(ctx) {
  // const { email } = ctx.request.body;

  // get user name by email
  // const user = await getUserWithCodeExpired(email);
  // ctx.assert(user, 403, 'Incorrect email');

  // const lastSend = user.code_expired_at - Date.now();
  // ctx.assert(
  //   lastSend < AUTH.CODE.ALLOW_ANEW_SEND_AFTER,
  //   403,
  //   `Wait ${lastSend} to resend code to email`,
  // );

  // // generate code and save in DB with expired time
  // const code = nanoid(AUTH.CODE.SIZE);
  // const expiredTime = Date.now() + AUTH.CODE.TIMELIFE;
  // await updateUserCode({ id: user.id, code, code_expired_at: new Date(expiredTime) });

  // send email with url to frontend
  // const stringifiedParams = querystring.stringify({ email, code });
  // await mail.recoverPassword(email, `${AUTH.CHANGE_PASSWORD_REDIRECT_URL}${stringifiedParams}`);

  ctx.body = { message: 'OK' };
}

async function verifyCode(email, code) {
  const user = await getUserWithCodeExpired(email);

  const isCodeAuthentic = user.code === code && user.code_expired_at > new Date();
  if (!isCodeAuthentic) {
    return false;
  }

  return user;
}

async function changePassword(ctx) {
  // const { email, code, password } = ctx.request.body;

  // const user = await verifyCode(email, code);
  // ctx.assert(user, 403, 'Invalid or expired code');

  // // check if it truly new password
  // ctx.assert(user.password_hash !== password, 400, 'Enter new password');

  // const passwordHashed = hash.create(getCredentialsString({ email, password }));
  // await updateUser({
  //   id: user.id,
  //   code: null,
  //   code_expired_at: null,
  //   password_hash: passwordHashed,
  // });

  // // Send email password changed
  // await mail.passwordChanged(email);

  ctx.body = { message: 'OK' };
}

async function checkCode(ctx) {
  // const { email, code } = ctx.request.params;

  // const user = await verifyCode(email, code);
  // ctx.assert(user, 403, 'Invalid or expired code');

  ctx.body = '';
}

module.exports = {
  registration,
  login,
  refresh,
  logout,
  forgotPassword,
  changePassword,
  checkCode,
};
