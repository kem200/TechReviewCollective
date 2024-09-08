const express = require('express');
const { Review, Product, User } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

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
        { model: User, attributes: ['id', 'username'] },
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

  try {
    const reviews = await Review.findAll({
      where: { user_id: userId },
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
router.post('/', async (req, res) => {
  const { product_id, user_id, title, content } = req.body;

  try {
    const review = await Review.create({ product_id, user_id, title, content });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a review
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Ensure the user is the owner of the review
    if (review.user_id !== req.body.user_id) {
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
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Ensure the user is the owner of the review
    if (review.user_id !== req.body.user_id) {
      return res.status(403).json({ error: 'You are not authorized to delete this review' });
    }

    await review.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
