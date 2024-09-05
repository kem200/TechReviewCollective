const express = require('express');
const { Product, ProductImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// GET /api/products/
// Returns the information for all products, including images
router.get('/', async (req, res, next) => {
  const { category } = req.query; // Get category from query parameters
  const page = parseInt(req.query.page) || 1; // Current page, default is 1
  const limit = parseInt(req.query.limit) || 20; // Items per page, default is 20
  const offset = (page - 1) * limit; // Calculate the offset

  try {
    const where = category ? { category } : {}; // Filter by category if provided

    const { count, rows: products } = await Product.findAndCountAll({
      where, // Apply the category filter
      limit: limit, // Limit the number of results per page
      offset: offset, // Skip the appropriate number of rows
      attributes: ['id', 'name', 'description', 'category', 'brand', 'model_number', 'createdAt', 'updatedAt'],
      include: [{ // Include associated ProductImages
        model: ProductImage,
        as: 'images', // Alias for the association
        attributes: ['id', 'url']
      }],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    return res.json({
      products,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:productId
// Returns the information for one product, including images
router.get('/:productId', async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByPk(productId, {
      include: [{ model: ProductImage, as: 'images' }]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products/
// Creates a new product (Requires authentication)
router.post('/', requireAuth, async (req, res, next) => {
  const { name, description, category, brand, model_number, images } = req.body;

  try {
    // Create the product first
    const newProduct = await Product.create({
      name,
      description,
      category,
      brand,
      model_number
    });


    if (images && images.length > 0) {
      const imageInstances = images.map((url) => ({
        product_id: newProduct.id,
        url
      }));
      await ProductImage.bulkCreate(imageInstances);
    }

    // Fetch the product with associated images
    const productWithImages = await Product.findByPk(newProduct.id, {
      include: [{ model: ProductImage, as: 'images', attributes: ['id', 'url'] }]
    });

    return res.status(201).json(productWithImages);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
// Returns the information for one product, including images
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id, {
      attributes: ['id', 'name', 'description', 'category', 'brand', 'model_number', 'createdAt', 'updatedAt'],
      include: [{ // Include associated ProductImages
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'url']
      }]
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
  const { name, description, category, brand, model_number, images } = req.body; // Accept images in the request

  try {
    const product = await Product.findByPk(id, {
      include: [{ model: ProductImage, as: 'images' }] // Include images for deletion or update
    });

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

    // Handle product images
    if (images) {
      // Delete existing images
      await ProductImage.destroy({ where: { product_id: id } });

      // Add new images
      const imageInstances = images.map((url) => ({
        product_id: id,
        url
      }));
      await ProductImage.bulkCreate(imageInstances);
    }

    // Fetch the updated product with associated images
    const updatedProduct = await Product.findByPk(id, {
      include: [{ model: ProductImage, as: 'images', attributes: ['id', 'url'] }]
    });

    return res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
