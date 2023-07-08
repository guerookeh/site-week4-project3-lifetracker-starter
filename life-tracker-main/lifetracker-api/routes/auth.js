const express = require('express');

const router = express.Router();

const User = require('../models/user.js');
const { requireAuthenticatedUser, extractUserFromJwt } = require('../middleware/security.js');

router.post('/login', async (req, res, next) => {
  try {
    const { email } = res.locals.user;
    const user = await User.fetchUserByEmail(email);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const userCredentials = req.body.credentials;
    const user = await User.register(userCredentials);
    res.cookie('jwt', user.jwt, { httpOnly: true });
    delete user.jwt;
    res.status(201).send(user);
  } catch(err) {
    next(err);
  }
});

