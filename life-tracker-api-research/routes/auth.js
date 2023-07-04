const express = require('express');
const router = express.Router();

const UserClass = require('../models/user.js');
const { requireAuthenticatedUser, extractUserFromJwt } = require('../middleware/security.js');

router.get('/selectUserJWT', requireAuthenticatedUser, extractUserFromJwt, async (req, res, next) => {
	// Include `requireAuthenticatedUser` (params autopassed) so as to pass request through middleware before route handler
	try {
		// Attempt to extract `email` property, this check is done in `requireAuthenticatedUser`
		const { email } = res.locals.user;
		// Fetch `user` object using `email` param through static method `fetchUserByEmail` and return it
		const user = await UserClass.fetchUserByEmail(email);
		res.status(200).send(user);
	} catch (err) {
		next(err);
	}	
});

router.post('/login', async (req, res, next) => {
  try {
    // Extract the user credentials from the credentials attribute in request.body
    const userCredentials = req.body.credentials;

    // Call the login method of the UserClass to perform the login process and retrieve the user object
    const user = await UserClass.login(userCredentials);

    // Set a cookie named 'jwt' in the response with the JWT obtained from the user object
    // The cookie is configured as 'httpOnly' to prevent client-side access
    res.cookie('jwt', user.jwt, { httpOnly: true });
    
    // Remove the 'jwt' attribute from the user object
    delete user.jwt;
    
    // Send a response with a status of '201 Created' and the user object as the response body
    res.status(201).send(user);
  } catch (err) {
    // If an error occurs during the login process, pass the error to the error handling middleware
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    // Encapsulate in try/catch block in case an error is thrown inside the .register() function

    // Extract the user credentials from the credentials attribute in request.body
    // The credentials object must contain properties: first_name, last_name, email, address, location, and password
    const userCredentials = req.body.credentials;

    // Call the register method of the UserClass to register the user with the provided credentials
    // Send a request from the frontend with credentials to trigger this route handler
    const user = await UserClass.register(userCredentials);

    // Set a cookie named 'userJWT' in the response with the JWT obtained from the user object
    // The cookie is configured as 'httpOnly' to prevent client-side access
    res.cookie('userJWT', user.jwt, { httpOnly: true });

    // Remove the 'jwt' attribute from the user object
    delete user.jwt;

    // Send a response with a status of '201 Created' and the user object as the response body
    res.status(201).send(user);
  } catch (err) {
    // If an error occurs during the registration process, pass the error to the error handling middleware
    next(err);
  }
});

module.exports = router;
