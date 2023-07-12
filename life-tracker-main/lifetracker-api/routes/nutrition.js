const express = require('express');

const router = express.Router();

const Nutrition = require('../models/nutrition.js');
const { requireAuthenticatedUser, extractUserFromJwtPayload } = require('../middleware/security.js');

// authentication middleware before accessing endpoints with protected resources
router.use(requireAuthenticatedUser, extractUserFromJwtPayload);

// at this point, user's cookie processed and jwt has been verified
// (if you have a jwt token, you can easily just change the id appended and screw with this...)
router.get('/fetchAllItems', async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    const itemsObject = await Nutrition.getAllItems(userId);
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
    res.status(201).json({ message, queryResult }); 
  } catch (err) {
    next(err);
  }
});

module.exports = router;
