const express = require('express');
const { Product } = require('../../db/models'); // Make sure to update this path based on your project structure
const { requireAuth } = require('../../utils/auth'); // Import your requireAuth middleware
const router = express.Router();

// GET /api/products/
// Returns the information for all products
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'name', 'description', 'category', 'brand', 'model_number', 'created_at', 'updated_at']
    });
    return res.json(products);
  } catch (err) {
    next(err);
  }
});

// POST /api/products/
// Creates a new product (Requires authentication)
router.post('/', requireAuth, async (req, res, next) => {
  const { name, description, category, brand, model_number } = req.body;

  try {
    const newProduct = await Product.create({
      name,
      description,
      category,
      brand,
      model_number
    });

    return res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
// Returns the information for one product
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id, {
      attributes: ['id', 'name', 'description', 'category', 'brand', 'model_number', 'created_at', 'updated_at']
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id
// Suggests edits to the information for one product (Requires authentication)
router.put('/:id', requireAuth, async (req, res, next) => {
  const { id } = req.params;
  const { name, description, category, brand, model_number } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.model_number = model_number || product.model_number;

    await product.save();

    return res.json(product);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
