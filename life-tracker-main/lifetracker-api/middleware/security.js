const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config.js');
const { UnauthorizedError } = require('../utils/erorrs.js');

function jwtFrom({ headers }) {
  const authorizationHeader = headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = authorizationHeader.split(' ')[1];
    return token;
  }

  const cookieHeader = headers.cookie;
  if (cookieHeader && cookieHeader.startsWith('jwt=')) {
    const token = cookie.split('=')[1];
    return token;
  }

  return undefined;
}

function requireAuthenticatedUser(req, res, next) {
  try {
    const token = jwtFrom(req);

    if (token) {
      res.locals.user = jwt.verify(token, SECRET_KEY);
    } else {
      throw new UnauthorizedError('Invalid or no token provided.');
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

function extractUserFromJwtPayload(req, res, next) {
  try {
    const { user } = res.locals;
    if (!user?.email) {
      throw new UnauthorizedError('User email was not provided in the payload.');
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  jwtFrom,
  extractUserFromJwt,
  requireAuthenticatedUser,
};
