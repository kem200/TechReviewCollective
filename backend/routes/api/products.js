const express = require('express');
const { Product, ProductImage, Rating } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { Op } = require('sequelize');
const sequelize = require('../../db/models').sequelize;

const router = express.Router();

// GET /api/products/
// Returns the information for all products, including images and average rating
router.get('/', async (req, res, next) => {
  const { category, search } = req.query; // Get category and search from query parameters
  const page = parseInt(req.query.page) || 1; // Current page, default is 1
  const limit = parseInt(req.query.limit) || 20; // Items per page, default is 20
  const offset = (page - 1) * limit; // Calculate the offset

  try {
    const where = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      // Determine the appropriate operator based on the database dialect
      const isPostgres = sequelize.getDialect() === 'postgres';
      const likeOperator = isPostgres ? Op.iLike : Op.like;
      where.name = { [likeOperator]: `%${search}%` }; // Case-insensitive search by product name
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where, // Apply the category and search filter
      limit: limit, // Limit the number of results per page
      offset: offset, // Skip the appropriate number of rows
      attributes: ['id', 'name', 'description', 'category', 'brand', 'model_number', 'createdAt', 'updatedAt'],
      include: [
        { // Include associated ProductImages
          model: ProductImage,
          as: 'images', // Alias for the association
          attributes: ['id', 'url']
        },
        { // Include associated Ratings
          model: Rating,
          as: 'ratings',
          attributes: ['rating']
        }
      ]
    });

    // Calculate average rating for each product
    const productsWithRatings = products.map(product => {
      const ratings = product.ratings.map(r => r.rating);
      const averageRating = ratings.length ? (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length) : null;

      // Manually construct the response object
      const productData = {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        model_number: product.model_number,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        images: product.images,
        averageRating
      };

      return productData;
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    return res.json({
      products: productsWithRatings,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:productId
// Returns the information for one product, including images and average rating
router.get('/:productId', async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByPk(productId, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: Rating, as: 'ratings', attributes: ['rating'] }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate average rating for the product
    const ratings = product.ratings.map(r => r.rating);
    const averageRating = ratings.length ? (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length) : null;

    // Manually construct the response object
    const productData = {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      model_number: product.model_number,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      images: product.images,
      averageRating
    };

    return res.json(productData);
  } catch (err) {
    next(err);
  }
});

// POST /api/products/
// Creates a new product (Requires authentication)
router.post('/', restoreUser, requireAuth, async (req, res, next) => {
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
