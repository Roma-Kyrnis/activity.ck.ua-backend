const { Facebook } = require('fb');

const config = require('../../config');

const FB = new Facebook();
FB.options({ version: 'v10.0' });

async function getUser(code) {
  const { access_token: accessToken } = await FB.api('oauth/access_token', {
    client_id: config.auth.facebook.CLIENT_ID,
    client_secret: config.auth.facebook.CLIENT_SECRET,
    redirect_uri: config.auth.facebook.REDIRECT_URL,
    code,
  });

  const user = await FB.api('me', {
    fields: ['id', 'name', 'picture'],
    access_token: accessToken,
  });

  return user;
}

module.exports = { getUser };
