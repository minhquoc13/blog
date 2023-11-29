const Comment = require("../models/CommentModel");
const Post = require("../models/PostModel");

const createComment = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const { content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      content,
      postId,
      author: userId,
    });

    await newComment.save();

    post.comments.push(newComment);

    await post.save();

    res.json(newComment);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const commentId = req.params.id;
    //  get postId
    // update content in comment by commentId
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const commentId = req.params.id;

    // delete comment if is post owner or comment owner
  } catch (error) {
    next(error);
  }
};

module.exports = { createComment, updateComment, deleteComment };
