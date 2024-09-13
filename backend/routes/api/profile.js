const express = require('express');
const { singleMulterUpload, singlePublicFileUpload } = require('../../services/aws');

const router = express.Router();

// Route to upload a profile image to S3
router.post('/upload-profile', singleMulterUpload('profileImage'), async (req, res) => {
    console.log('Incoming file:', req.file); // Log the file data

    const file = req.file; // Access the uploaded file

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' }); // Handle the case where no file is uploaded
    }

    try {
      // Upload the file to S3 using the utility function
      const imageUrl = await singlePublicFileUpload(file); // Get the URL of the uploaded image from S3

      // Send back the URL of the uploaded image
      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error('Error uploading profile image to S3:', error); // Log any errors that occur
      res.status(500).json({ error: 'Failed to upload profile image' }); // Respond with a 500 status code if there is an error
    }
  });

module.exports = router;
