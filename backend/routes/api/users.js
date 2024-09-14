// backend/routes/api/users.js
const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

  router.post('/', validateSignup, async (req, res) => {
    const { email, password, username, display_name } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email or username already exists'
      });
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword, display_name });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.display_name,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  });

module.exports = router;
