// routes/api/categories.js
const express = require('express');
const { Category } = require('../../db/models');

const router = express.Router();

// GET /api/categories
// Returns a list of all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name'], // Only fetch the necessary attributes
      order: [['name', 'ASC']], // Order alphabetically by name
    });
    return res.json(categories);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
