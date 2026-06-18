const ffmpeg = require(
  "fluent-ffmpeg"
);

const ffmpegPath =
  require("ffmpeg-static");

ffmpeg.setFfmpegPath(
  ffmpegPath
);

const fs = require("fs");

const path = require("path");


// ==========================
// EXTRACT FRAMES
// ==========================

const extractFrames =
  async (videoPath) => {

    try {

      // CHECK VIDEO EXISTS
      if (
        !fs.existsSync(
          videoPath
        )
      ) {

        console.log(
          "VIDEO NOT FOUND:",
          videoPath
        );

        return [];
      }

      const framesDir =
        path.join(
          process.cwd(),
          "src",
          "uploads",
          "frames"
        );

      // CREATE FRAMES DIRECTORY
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
      const oldFrames =
        fs.readdirSync(
          framesDir
        );

      for (const frame of oldFrames) {

        fs.unlinkSync(
          path.join(
            framesDir,
            frame
          )
        );
      }

      console.log(
        "STARTING FFMPEG..."
      );

      // EXTRACT FRAMES
      await new Promise(
        (
          resolve,
          reject
        ) => {

          ffmpeg(videoPath)

            .screenshots({

              count: 3,

              folder:
                framesDir,

              filename:
                "frame-%i.png",
            })

            .on(
              "end",
              () => {

                console.log(
                  "FRAME EXTRACTION DONE"
                );

                resolve();
              }
            )

            .on(
              "error",
              (err) => {

                console.log(
                  "FFMPEG ERROR:",
                  err
                );

                reject(err);
              }
            );
        }
      );

      const frames =
        fs.readdirSync(
          framesDir
        );

      console.log(
        "FRAMES:",
        frames
      );

      return frames;

    } catch (error) {

      console.log(
        "EXTRACT ERROR:",
        error
      );

      return [];
    }
  };


// ==========================
// MODERATION
// ==========================

const moderateFrames =
  async (frames) => {

    try {

      console.log(
        "MODERATING:",
        frames
      );

      // SIMULATED MODERATION
      const random =
        Math.random();

      if (random > 0.7) {

        return "flagged";
      }

      return "safe";

    } catch (error) {

      console.log(
        "MODERATION ERROR:",
        error
      );

      return "safe";
    }
  };


module.exports = {

  extractFrames,

  moderateFrames,
};