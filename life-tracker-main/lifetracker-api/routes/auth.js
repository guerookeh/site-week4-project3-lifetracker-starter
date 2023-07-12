const express = require('express');

const router = express.Router();

const { BACKEND_URL } = require('../config.js');
const User = require('../models/user.js');
const { requireAuthenticatedUser, extractUserFromJwt } = require('../middleware/security.js');

router.post('/login', async (req, res, next) => {
  try {
    console.log(req.cookies);
    const userCredentials = req.body.credentials;
    const user = await User.login(userCredentials);
    const cookieOptions = {
      expires: new Date(Date.now() + 36000000),
      httpOnly: true,
      sameSite: 'lax',
    };
    res.cookie('jwt', user.jwt, cookieOptions);
    delete user.jwt;
    const message = 'User successfully logged in.';
    res.status(201).json({ message, user });
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const userCredentials = req.body.credentials;
    const user = await User.register(userCredentials);
    const cookieOptions = {
      expires: new Date(Date.now() + 36000000),
      httpOnly: true,
      sameSite: 'lax',
    };
    res.cookie('jwt', user.jwt, cookieOptions);
    delete user.jwt;
    const message = 'User successfully registered.';
    res.status(201).json({ message, user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
