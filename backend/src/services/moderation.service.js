const ffmpeg = require(
  "fluent-ffmpeg"
);

const fs = require("fs");

const path = require("path");


// ==========================
// EXTRACT FRAMES
// ==========================

const extractFrames =
  async (videoPath) => {

    try {

      const framesDir =
        path.join(
          process.cwd(),
          "src",
          "uploads",
          "frames"
        );

      // CREATE FOLDER
      if (
        !fs.existsSync(
          framesDir
        )
      ) {

        fs.mkdirSync(
          framesDir,
          {
            recursive: true,
          }
        );
      }

      // CLEAR OLD FRAMES
      fs.readdirSync(
        framesDir
      ).forEach((file) => {

        fs.unlinkSync(
          path.join(
            framesDir,
            file
          )
        );
      });

      // EXTRACT FRAMES
      await new Promise(
        (
          resolve,
          reject
        ) => {

          ffmpeg(videoPath)

            .screenshots({

              count: 5,

              folder:
                framesDir,

              filename:
                "frame-%i.png",
            })

            .on(
              "end",
              resolve
            )

            .on(
              "error",
              reject
            );
        }
      );

      const frames =
        fs.readdirSync(
          framesDir
        );

      return frames;

    } catch (error) {

      console.log(error);

      return [];
    }
  };


// ==========================
// MODERATE FRAMES
// ==========================

const moderateFrames =
  async (frames) => {

    console.log(
      "Analyzing Frames:",
      frames
    );

    // SIMULATED MODERATION

    const random =
      Math.random();

    if (random > 0.7) {

      return "flagged";
    }

    return "safe";
  };


module.exports = {

  extractFrames,

  moderateFrames,
};