const express = require('express');
const { Review, Product, User } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();
const { requireAuth , restoreUser } = require('../../utils/auth');

// Get all reviews for a specific product with pagination
router.get('/product/:productId', async (req, res) => {
  const { productId } = req.params;
  const { page = 1 } = req.query;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const reviews = await Review.findAndCountAll({
      where: { product_id: productId },
      limit,
      offset,
      include: [
        { model: User, attributes: ['id', 'username', 'display_name'] },
        { model: Product, attributes: ['id', 'name'] }
      ]
    });

    res.json({
      reviews: reviews.rows,
      totalPages: Math.ceil(reviews.count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reviews from a specific user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.query;

  try {
    let whereClause = { user_id: userId };
    if (productId) {
      whereClause.product_id = productId;
    }

    const reviews = await Review.findAll({
      where: whereClause,
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Product, attributes: ['id', 'name'] }
      ]
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a review
router.post('/', restoreUser, requireAuth, async (req, res) => {
  const { product_id, content } = req.body;
  const { user } = req;
  const existingReview = await Review.findOne({
    where: {
      product_id,
      user_id: user.id
    }
  });

  if (existingReview) {
    return res.status(400).json({ error: 'You have already reviewed this product' });
  }

  console.log(req.body)
  try {
    const review = await Review.create({ product_id, user_id: user.id, content });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a review
router.put('/:id', restoreUser, requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Ensure the user is the owner of the review
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this review' });
    }

    review.title = title;
    review.content = content;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a review
router.delete('/:id', restoreUser, requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Ensure the user is the owner of the review
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this review' });
    }

    await review.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
