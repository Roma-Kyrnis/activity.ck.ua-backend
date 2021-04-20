const { google } = require('googleapis');

const config = require('../../config');

const oAuth2Client = new google.auth.OAuth2({
  clientId: config.auth.CLIENT_ID,
  clientSecret: config.auth.CLIENT_SECRET,
  redirectUri: config.auth.REDIRECT_URL,
});

module.exports = { oAuth2Client };
