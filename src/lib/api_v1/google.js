const { google } = require('googleapis');

const config = require('../../config');

const oAuth2Client = new google.auth.OAuth2({
  clientId: config.auth.CLIENT_ID,
  clientSecret: config.auth.CLIENT_SECRET,
  redirectUri: config.auth.REDIRECT_URL,
});

async function getUserPayload(code) {
  const ticket = await oAuth2Client.getToken(code);
  const { payload } = await oAuth2Client.verifyIdToken({ idToken: ticket.tokens.id_token });

  return payload;
}

module.exports = { getUserPayload };
