
const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: String,
    videoUrl: String,
    thumbnail: String,
  },
  { timestamps: true }
);


module.exports = mongoose.model("Video", videoSchema, "videofiles");

