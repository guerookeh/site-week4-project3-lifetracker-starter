const express = require('express');

const router = express.Router();

const { requireAuthenticatedUser, extractUserFromJwt } = require('../middleware/security.js');

router.get('/fetchAllItems', async (req, res, next) => {
  try {


  } catch (err) {
    next(err);
  }
});

router.post('/addItem', async (req, res, next) => {
  try {


  } catch (err) {
    next(err);
  }
});

module.exports = router;
