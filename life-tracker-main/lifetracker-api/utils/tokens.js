const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config.js');

function generateToken(data) {
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
    const decodedPayload = jwt.verify(token, SECRET_KEY);
    return decodedPayload;
  } catch (err) {
    return {};
  }
}

module.exports = {
  generateToken,
  createUserJwt,
  validateToken,
};
