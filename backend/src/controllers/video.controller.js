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

    if (!file) {

      return res.status(400).json({
        message:
          "No video uploaded",
      });
    }

    const video =
      await Video.create({

        title:
          req.body.title ||
          file.originalname,

        filename:
          file.filename,

        originalName:
          file.originalname,

        size:
          file.size,

        uploadedBy:
          req.user.id,

        tenantId:
          req.user.tenantId,

        status:
          "processing",

        progress: 0,

        sensitivity:
          "processing",
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
            const sensitivity =
              await moderateFrames(
                frames
              );

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

exports.streamVideo =
  async (req, res) => {

    try {

      const video =
        await Video.findById(
          req.params.id
        );
        console.log(
  "STREAM VIDEO:",
  video
);

      if (!video) {

        return res.status(404).json({
          message:
            "Video not found",
        });
      }

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

console.log(
  "FILE EXISTS:",
  fs.existsSync(videoPath)
);

      if (
        !fs.existsSync(
          videoPath
        )
      ) {

        return res.status(404).json({
          message:
            "Video file missing",
        });
      }

      const stat =
        fs.statSync(
          videoPath
        );

      const fileSize =
        stat.size;

      const range =
        req.headers.range;

      if (!range) {

        return res.status(400).send(
          "Requires Range header"
        );
      }

      const parts =
        range
          .replace(
            /bytes=/,
            ""
          )
          .split("-");

      const start =
        parseInt(
          parts[0],
          10
        );

      const end =
        parts[1]
          ? parseInt(
              parts[1],
              10
            )
          : fileSize - 1;

      const chunkSize =
        end - start + 1;

      const file =
        fs.createReadStream(
          videoPath,
          {
            start,
            end,
          }
        );

      const headers = {

        "Content-Range":
          `bytes ${start}-${end}/${fileSize}`,

        "Accept-Ranges":
          "bytes",

        "Content-Length":
          chunkSize,

        "Content-Type":
          "video/mp4",
      };

      res.writeHead(
        206,
        headers
      );

      file.pipe(res);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };