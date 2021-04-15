const admin = require('firebase-admin');

const {
  firebase: { serviceAccount },
} = require('../../config');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function getCustomToken(id, role) {
  return await admin.auth().createCustomToken(id.toString(), { id, role });
}

module.exports = { getCustomToken };
