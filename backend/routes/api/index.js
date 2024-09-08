// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const productsRouter = require('./products.js');
const ratingsRouter = require('./ratings.js');
const reviewsRouter = require('./reviews.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/products', productsRouter);

router.use('/ratings', ratingsRouter);

router.use('/reviews', reviewsRouter);

module.exports = router;
