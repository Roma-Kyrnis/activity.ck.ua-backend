const admin = require('firebase-admin');

const {
  firebase: { serviceAccount },
} = require('../../config');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function getCustomToken(user) {
  return await admin.auth().createCustomToken(user.id, user);
}

module.exports = { getCustomToken };
