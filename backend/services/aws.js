const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const NAME_OF_BUCKET = "techreviewcollective";
const multer = require("multer");

// Initialize S3 client
const s3 = new S3Client({ region: "us-east-2" }); // Adjust the region if necessary

// --------------------------- Public UPLOAD ------------------------

const singlePublicFileUpload = async (file) => {
  const { originalname, buffer } = file;
  const path = require("path");
  const Key = new Date().getTime().toString() + path.extname(originalname); // Generate a unique key
  const uploadParams = {
    Bucket: NAME_OF_BUCKET,
    Key,
    Body: buffer,
  };

  const command = new PutObjectCommand(uploadParams);
  const result = await s3.send(command);

  // Construct the public URL
  return `https://${NAME_OF_BUCKET}.s3.amazonaws.com/${Key}`;
};

// --------------------------- Storage ------------------------

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const singleMulterUpload = (nameOfKey) => multer({ storage: storage }).single(nameOfKey);

module.exports = {
  singlePublicFileUpload,
  singleMulterUpload,
};
