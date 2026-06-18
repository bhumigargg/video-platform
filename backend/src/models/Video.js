const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    videoUrl: String,
cloudinaryId: String,
    title: String,
    filename: String,
    originalName: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tenantId: String,
    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "processing",
    },
    sensitivity: {
      type: String,
      enum: ["safe", "flagged","processing"],
      default: "processing",
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);