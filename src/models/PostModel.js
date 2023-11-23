// models/Post.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  isUpdatedAt: { type: Date, default: null },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
