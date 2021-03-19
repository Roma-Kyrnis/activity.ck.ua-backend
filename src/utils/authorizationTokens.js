const jwt = require('jsonwebtoken');

const {
  server: {
    tokens: { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE },
  },
} = require('../config');

async function generateAccessToken(payload) {
  return await jwt.sign(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
}

async function generateRefreshToken(payload) {
  return await jwt.sign(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
}

async function verifyAccessToken(token) {
  return await jwt.verify(token, ACCESS_TOKEN_SECRET);
}

async function verifyRefreshToken(token) {
  return await jwt.verify(token, REFRESH_TOKEN_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
