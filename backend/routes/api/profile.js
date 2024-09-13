const express = require('express');
const { User, ProfileImage } = require('../../db/models'); // Import the ProfileImage model
const { requireAuth, restoreUser } = require('../../utils/auth');
const { singleMulterUpload, singlePublicFileUpload, deleteFileFromS3 } = require('../../services/aws');

const router = express.Router();

// Route to upload a profile image to S3
router.post('/upload-profile', restoreUser, requireAuth, singleMulterUpload('profileImage'), async (req, res) => {
  const file = req.file; // Access the uploaded file
  const userId = req.user.id; // Get user ID from the request

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' }); // Handle the case where no file is uploaded
  }

  try {
    // Upload the file to S3 using the utility function
    const imageUrl = await singlePublicFileUpload(file); // Get the URL of the uploaded image from S3

    // Save the uploaded image URL to the ProfileImages table
    const profileImage = await ProfileImage.create({
      userId,
      url: imageUrl,
    });

    // Send back the URL of the uploaded image
    res.status(200).json({ imageUrl: profileImage.url });
  } catch (error) {
    console.error('Error uploading profile image to S3:', error); // Log any errors that occur
    res.status(500).json({ error: 'Failed to upload profile image' }); // Respond with a 500 status code if there is an error
  }
});

// Route to update user information
router.put('/update-profile', restoreUser, requireAuth, async (req, res) => {
  const { display_name, bio } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      user.display_name = display_name;
      user.bio = bio;
      await user.save();
      return res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Route to delete a profile image
router.delete('/delete-profile-image', restoreUser, requireAuth, async (req, res) => {
  const userId = req.user.id; // Get user ID from the request

  try {
    // Find and delete the profile image associated with the user
    const profileImage = await ProfileImage.findOne({ where: { userId } });

    if (profileImage) {
      // Extract the S3 key from the URL
      const imageUrl = profileImage.url;
      const key = imageUrl.split('/').pop(); // Get the file key from URL

      await deleteFileFromS3(key); // Delete the file from S3
      await profileImage.destroy(); // Delete the profile image record from the table

      return res.json({ message: 'Profile image deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Profile image not found' });
    }
  } catch (error) {
    console.error('Error deleting profile image:', error); // Log any errors that occur
    res.status(500).json({ error: 'Failed to delete profile image' }); // Respond with a 500 status code if there is an error
  }
});

// Route to delete user account
router.delete('/delete-account', restoreUser, requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      await user.destroy(); // Delete the user and cascade to delete profile images
      return res.json({ message: 'Account deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
