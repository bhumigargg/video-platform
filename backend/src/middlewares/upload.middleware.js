const multer = require("multer");
const {
  CloudinaryStorage,
} = require(
  "multer-storage-cloudinary"
);

const cloudinary =
  require("../config/cloudinary");

const storage =
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "videos",
      resource_type: "video",
    },
  });

module.exports =
  multer({ storage });