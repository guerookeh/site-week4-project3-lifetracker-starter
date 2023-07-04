const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config.js');
const { UnauthorizedError } = require('../utils/errors.js');

function jwtFrom({ headers }) {

	// Extract the authorization headers from the original request
	const authorizationHeader = headers.authorization;
	
	// Check if the authorization scheme is 'Bearer: '
	if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
		const token = authorizationHeader.split(' ')[1];
		return token;
	}

	// If it's a header with a cookie, extract cookie from request
	const cookieHeader = headers.cookie;
	if (cookieHeader) {
    const cookies = cookieHeader.split(':');
    for (let i = 0; i < cookies.length; ++i) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('jwt=')) {
        const token = cookie.split('=')[1];
        return token;
      }
    }
  }
	
	// If any previous conditions are not met, incorrect authentication scheme, return undefined
	return undefined;

}

function requireAuthenticatedUser(req, res, next) {

	// Extract JWT token from request by calling jwtFrom
	try {

		// This will throw an error if `undefined` is returned from `jwtFrom(req.headers)`
		const token = jwtFrom(req);

		// If token signature verification fails, `jwt.verify(token, secret_key)` will throw an error
		// verification of: [signature, expiration time, issuer, audience]
		if (token) {
			res.locals.user = jwt.verify(token, SECRET_KEY);
	  } else {
      throw new UnauthorizedError('Invalid or no token provided.');
    }

		// At this point `res.locals.user` contains the decoded payload of the token, which includes claims and data
		// `res.locals.user` object is used to store response local variables  
		return next();

	} catch (err) {

		// Error is caught and passed to post-processing error handling middleware here
		return next(err);

	}

}

function extractUserFromJwt(req, res, next) {

	// This authentication method ONLY checks to see if user included an email in the payload
	try {

		// Destructure the `res.locals` object to extract the user
		const { user } = res.locals;

		// If this object DOES NOT contain an email, throw an unauthorized error
		if (!user?.email) throw new UnauthorizedError('User email was not provided in the payload.');	

		// Otherwise, they are marked as authorized and this is passed to next middleware	
		return next();

	} catch (err) {
		return next(err);
	}

}

module.exports = {
	jwtFrom,
	extractUserFromJwt,
	requireAuthenticatedUser
}
