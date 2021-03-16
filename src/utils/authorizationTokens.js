const jwt = require('jsonwebtoken');

const {
  server: {
    tokens: { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE },
  },
} = require('../config');

async function generateToken(payload, secretKey, tokenLife) {
  return await jwt.sign(payload, secretKey, { expiresIn: tokenLife });
}

async function verifyToken(token, secretKey) {
  return await jwt.verify(token, secretKey);
}

async function generateAccessToken(payload) {
  return await generateToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
}

async function generateRefreshToken(payload) {
  return await generateToken(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
}

async function verifyAccessToken(token) {
  return await verifyToken(token, ACCESS_TOKEN_SECRET);
}

async function verifyRefreshToken(token) {
  return await verifyToken(token, REFRESH_TOKEN_SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
