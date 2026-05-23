const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (
  req,
  file,
  cb
) {

  const uploadPath =
    "src/uploads/raw";

  if (
    !fs.existsSync(
      uploadPath
    )
  ) {

    fs.mkdirSync(
      uploadPath,
      {
        recursive: true,
      }
    );
  }

  cb(null, uploadPath);
},
});

const fileFilter = (req, file, cb) => {
  const allowed = ["video/mp4", "video/mkv", "video/webm"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500,
  },
});

module.exports = upload;