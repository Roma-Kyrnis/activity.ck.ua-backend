const crypto = require('crypto');

const {
  server: { HASH_SECRET },
} = require('../config');

function create(data) {
  return crypto.createHmac('sha256', HASH_SECRET).update(data).digest('hex');
}

function compare(checkHash, originHash) {
  return crypto.timingSafeEqual(Buffer.from(checkHash), Buffer.from(originHash));
}

module.exports = { create, compare };
