const express = require('express');
const { Rating } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth');
const router = express.Router();

// GET /api/ratings/
// Returns all ratings created by the authenticated user
// Returns the rating for a specific product created by the authenticated user
router.get('/', restoreUser, requireAuth, async (req, res, next) => {
  const { user } = req;
  const { product_id } = req.query;

  try {
    const rating = await Rating.findOne({
      where: { product_id, user_id: user.id }
    });

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    return res.json(rating);
  } catch (err) {
    next(err);
  }
});

// POST /api/ratings/
// Creates a new rating (Requires authentication)
router.post('/', restoreUser, requireAuth, async (req, res, next) => {
  const { user } = req;
  const { product_id, rating } = req.body;

  const existingRating = await Rating.findOne({
    where: { product_id, user_id: user.id }
  });

  if (existingRating) {
    return res.status(400).json({ message: 'Rating already exists' });
  }

  try {
    const newRating = await Rating.create({
      product_id,
      user_id: user.id,
      rating
    });

    return res.status(201).json(newRating);
  } catch (err) {
    next(err);
  }
});

// PUT /api/ratings/:ratingId
// Updates an existing rating created by the authenticated user
router.put('/:ratingId', restoreUser, requireAuth, async (req, res, next) => {
  const { user } = req;
  const { ratingId } = req.params;
  const { rating } = req.body;

  try {
    const existingRating = await Rating.findOne({
      where: { id: ratingId, user_id: user.id }
    });

    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    existingRating.rating = rating;
    await existingRating.save();

    return res.json(existingRating);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/ratings/:ratingId
// Deletes an existing rating created by the authenticated user
router.delete('/:ratingId', restoreUser, requireAuth, async (req, res, next) => {
  const { user } = req;
  const { ratingId } = req.params;

  try {
    const existingRating = await Rating.findOne({
      where: { id: ratingId, user_id: user.id }
    });

    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    await existingRating.destroy();

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
