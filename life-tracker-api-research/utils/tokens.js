const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config.js');
// const { BadRequestError } = require('./utils/error.js');

function generateToken(data) {
  // Default algorithm to sign the token is (synchronous) HMAC SHA256, `data` is implicitly coerced into string using `JSON.stringify`
  const token = jwt.sign(data, SECRET_KEY, { expiresIn: '1d' });
  return token;
}

function createUserJwt(user) {
  const payload = { id: user.id, email: user.email };
  const token = generateToken(payload);
  return token;
}

function validateToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    return {};
  }
}

module.exports = {
  generateToken,
  createUserJwt,
  validateToken,
};
