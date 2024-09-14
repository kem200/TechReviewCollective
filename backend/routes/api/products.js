const express = require('express');
const { Product, ProductImage, Rating, Category } = require('../../db/models'); // Include Category model
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

    if (search) {
      // Determine the appropriate operator based on the database dialect
      const isPostgres = sequelize.getDialect() === 'postgres';
      const likeOperator = isPostgres ? Op.iLike : Op.like;
      where.name = { [likeOperator]: `%${search}%` }; // Case-insensitive search by product name
    }

    const isPostgres = sequelize.getDialect() === 'postgres';
    const likeOperator = isPostgres ? Op.iLike : Op.like;

    // Modify the categoryWhere to be case insensitive
    const categoryWhere = category ? { name: { [likeOperator]: category } } : {};

    const { count, rows: products } = await Product.findAndCountAll({
      where, // Apply the search filter
      limit: limit, // Limit the number of results per page
      offset: offset, // Skip the appropriate number of rows
      attributes: ['id', 'name', 'description', 'brand', 'model_number', 'createdAt', 'updatedAt'],
      include: [
        {
          model: ProductImage,
          as: 'images', // Alias for the association
          attributes: ['id', 'url']
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating']
        },
        {
          model: Category,
          as: 'category', // Alias for the association
          where: categoryWhere, // Filter by category name here with case-insensitivity
          attributes: ['id', 'name']
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
        category: product.category.name, // Use the category name from the association
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
        { model: Rating, as: 'ratings', attributes: ['rating'] },
        { model: Category, as: 'category', attributes: ['name'] } // Include Category for category name
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
      category: product.category ? product.category.name : null, // Use the category name from the Category table
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
  console.log(req.body);
  try {
    // Check if a product with the same name already exists
    const existingProductByName = await Product.findOne({ where: { name } });
    if (existingProductByName) {
      return res.status(400).json({ errors: { name: 'A product with this name already exists.' } });
    }

    // Check if a product with the same model number already exists
    const existingProductByModelNumber = await Product.findOne({ where: { model_number } });
    if (existingProductByModelNumber) {
      return res.status(400).json({ errors: { model_number: 'A product with this model number already exists.' } });
    }

    // Create the product if no duplicates are found
    const newProduct = await Product.create({
      name,
      description,
      category_id: category,
      brand,
      model_number
    });

    // Add images if provided
    if (images && images.length > 0) {
      const imageInstances = images.map((url) => ({
        product_id: newProduct.id,
        url
      }));
      await ProductImage.bulkCreate(imageInstances);
    }

    // Fetch the product with associated images and category name
    const productWithImages = await Product.findByPk(newProduct.id, {
      include: [
        { model: ProductImage, as: 'images', attributes: ['id', 'url'] },
        { model: Category, as: 'category', attributes: ['name'] }
      ]
    });

    return res.status(201).json(productWithImages);
  } catch (err) {
    // Return validation errors or other errors as JSON
    return res.status(500).json({ errors: { server: 'An error occurred while creating the product.' } });
  }
});

module.exports = router;
