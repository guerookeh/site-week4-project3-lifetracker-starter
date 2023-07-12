const express = require('express');

const router = express.Router();

const Nutrition = require('../models/nutrition.js');
const { requireAuthenticatedUser, extractUserFromJwtPayload } = require('../middleware/security.js');

// authentication middleware before accessing endpoints with protected resources
// middleware will attach the decoded jwt payload in res.locals to access user id
router.use(requireAuthenticatedUser, extractUserFromJwtPayload);

router.get('/fetchAllItems', async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    const queryResult = await Nutrition.getAllItems(userId);
    const itemsObject = queryResult.rows;
    const message = 'Nutrition items successfully fetched.';
    res.status(201).json({ message, itemsObject });
  } catch (err) {
    next(err);
  }
});

router.post('/addItem', async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    const userItemObj = req.body.itemObj;
    const reqObj = { ...userItemObj, user_id: userId  };
    const queryResult = await Nutrition.addItem(reqObj);
    const message = 'Nutrition item successfuly inserted.';
    res.status(201).json({ message }); 
  } catch (err) {
    next(err);
  }
});

module.exports = router;
