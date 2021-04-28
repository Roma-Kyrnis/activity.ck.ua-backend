const { google } = require('googleapis');

const {
  AUTH: {
    GOOGLE: { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL_LOGIN, REDIRECT_URL_REGISTRATION },
  },
} = require('../../config');

const oAuth2ClientRegistration = new google.auth.OAuth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URL_REGISTRATION,
});

const oAuth2ClientLogin = new google.auth.OAuth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URL_LOGIN,
});

async function getUserPayloadLogin(code) {
  const ticket = await oAuth2ClientLogin.getToken(code);
  const { payload } = await oAuth2ClientLogin.verifyIdToken({ idToken: ticket.tokens.id_token });

  return payload;
}

async function getUserPayloadRegistration(code) {
  const ticket = await oAuth2ClientRegistration.getToken(code);
  const { payload } = await oAuth2ClientRegistration.verifyIdToken({
    idToken: ticket.tokens.id_token,
  });

  return payload;
}

module.exports = { getUserPayloadLogin, getUserPayloadRegistration };
