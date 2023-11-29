const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isArchived: {
      type: Boolean,
      default: false,
      required: true,
    },
    isUpdatedAt: { type: Date, default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
