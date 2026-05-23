const multer = require("multer");

const path = require("path");

const fs = require("fs");


// CREATE UPLOAD DIRECTORY
const uploadPath = path.join(
  process.cwd(),
  "src",
  "uploads",
  "raw"
);

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


// STORAGE CONFIG
const storage =
  multer.diskStorage({

    destination: function (
      req,
      file,
      cb
    ) {

      cb(
        null,
        uploadPath
      );
    },

    filename: function (
      req,
      file,
      cb
    ) {

      cb(
        null,
        Date.now() +
          path.extname(
            file.originalname
          )
      );
    },
  });


// FILE FILTER
const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    file.mimetype.startsWith(
      "video"
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only video files allowed"
      ),
      false
    );
  }
};


// MULTER EXPORT
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;