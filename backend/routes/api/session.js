const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, ProfileImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors
];



// Log in
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential
      }
    }
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    err.errors = { credential: 'Invalid credentials' };
    return next(err);
  }

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

router.get('/', async (req, res) => {
  const { user } = req;

  if (user) {
    try {
      // Fetch the profile image for the user
      const profileImage = await ProfileImage.findOne({
        where: { userId: user.id },
      });

      const safeUser = {
        id: user.id,
        display_name: user.display_name,
        email: user.email,
        bio: user.bio,
        username: user.username,
        profile_picture: user.profile_picture,
        profileImageUrl: profileImage ? profileImage.url : null,
        createdAt: user.createdAt,
      };

      return res.json({
        user: safeUser,
      });
    } catch (err) {
      console.error('Error fetching profile image:', err);
      return res.status(500).json({ error: 'Failed to fetch profile image' });
    }
  } else {
    return res.json({ user: null });
  }
});

router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
}
);

module.exports = router;
