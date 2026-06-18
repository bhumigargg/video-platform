const { getIO } = require("../socket");

const fs = require("fs");

const path = require("path");

const Video = require("../models/Video");

const {
  extractFrames,
  moderateFrames,
} = require(
  "../services/moderation.service"
);
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "raw"
);

if (
  !fs.existsSync(
    uploadDir
  )
) {

  fs.mkdirSync(
    uploadDir,
    {
      recursive: true,
    }
  );
}

// ==========================
// Upload Video
// ==========================

exports.uploadVideo = async (
  req,
  res
) => {

  try {

    const file = req.file;
    console.log("FILE OBJECT:");
console.log(req.file);
    if (!file) {

      return res.status(400).json({
        message:
          "No video uploaded",
      });
    }

    const video = await Video.create({
      title: req.body.title || file.originalname,

      videoUrl: file.path,

      cloudinaryId: file.filename,

      originalName: file.originalname,

      size: file.size,

      uploadedBy: req.user.id,

      tenantId: req.user.tenantId,

      status: "processing",

      progress: 0,

      sensitivity: "processing",
    });

    // START PROCESSING
    simulateProcessing(
      video._id
    );

    res.status(201).json({

      success: true,

      message:
        "Video uploaded successfully",

      video,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ==========================
// VIDEO PROCESSING
// ==========================

const simulateProcessing =
  async (videoId) => {

    const io = getIO();

    let progress = 0;

    const interval =
      setInterval(

        async () => {

          progress += 20;

          // UPDATE PROGRESS
          await Video.findByIdAndUpdate(
            videoId,
            {
              progress,
            }
          );

          // SOCKET EVENT
          io.emit(
            "processing-progress",
            {
              videoId,
              progress,
            }
          );

          // PROCESS COMPLETE
          if (progress >= 100) {

            clearInterval(
              interval
            );

            // GET VIDEO
            
            const video =
              await Video.findById(
                videoId
              );
              

            if (!video) {
              return;
            }

            // VIDEO PATH
            const videoPath =
              path.join(
                process.cwd(),
                "src",
                "uploads",
                "raw",
                video.filename
              );

            console.log(
              "VIDEO PATH:",
              videoPath
            );

            // EXTRACT FRAMES
            const frames =
              await extractFrames(
                videoPath
              );

            console.log(
              "FRAMES:",
              frames
            );

            // MODERATE
            const framePath = frames[0];

const result =
  await axios.post(
    process.env.MODERATION_URL,
    {
      image: framePath,
    }
  );

const sensitivity =
  result.data.sensitivity;

            console.log(
              "SENSITIVITY:",
              sensitivity
            );

            // UPDATE VIDEO
            await Video.findByIdAndUpdate(
              videoId,
              {
                status:
                  "completed",

                sensitivity,

                progress: 100,
              }
            );

            // SOCKET EVENT
            io.emit(
              "processing-complete",
              {
                videoId,
                sensitivity,
              }
            );
          }

        },

        2000
      );
  };


// ==========================
// GET ALL VIDEOS
// ==========================

exports.getVideos = async (
  req,
  res
) => {

  try {

    const videos =
      await Video.find({

        tenantId:
          req.user.tenantId,

      }).sort({
        createdAt: -1,
      });

    res.json({

      success: true,

      count:
        videos.length,

      videos,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ==========================
// GET SINGLE VIDEO
// ==========================

exports.getSingleVideo =
  async (req, res) => {

    try {

      const video =
        await Video.findOne({

          _id:
            req.params.id,

          tenantId:
            req.user.tenantId,
        });

      if (!video) {

        return res.status(404).json({
          message:
            "Video not found",
        });
      }

      res.json(video);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };


// ==========================
// DELETE VIDEO
// ==========================

exports.deleteVideo =
  async (req, res) => {

    try {

      const video =
        await Video.findOne({

          _id:
            req.params.id,

          tenantId:
            req.user.tenantId,
        });

      if (!video) {

        return res.status(404).json({
          message:
            "Video not found",
        });
      }

      // DELETE FILE
      const videoPath =
        path.join(

          process.cwd(),

          "src",

          "uploads",

          "raw",

          video.filename
        );

      if (
        fs.existsSync(
          videoPath
        )
      ) {

        fs.unlinkSync(
          videoPath
        );
      }

      await video.deleteOne();

      res.json({

        success: true,

        message:
          "Video deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };


// ==========================
// STREAM VIDEO
// ==========================

