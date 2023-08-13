const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    imgFile: {
      public_id: String,
      secure_url: String,
    },
    videoFile: {
      public_id: String,
      secure_url: String,
    },
    audioFile: {
      public_id: String,
      secure_url: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", postSchema);
