const Comment = require("../models/CommentModel");
const Post = require("../models/PostModel");

const createComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;
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

const getAllCommentByPostId = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId: postId });
    if (!comments) {
      throw new Error("Comment not found");
    }

    const countComment = comments.length;
    res.json({ comments, countComment });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const commentId = req.params.commentId;
    const { content } = req.body;

    let updateComment = await Comment.findById(commentId);

    if (!updateComment) {
      throw new Error("Comment not found");
    }

    if (updateComment.author.toString() !== userId) {
      throw new Error("Not authorized!");
    }

    updateComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );
    res.json(updateComment);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const commentId = req.params.commentId;

    let deleteComment = await Comment.findById(commentId);

    if (!deleteComment) {
      throw new Error("Comment not found");
    }

    console.log(deleteComment);
    console.log(userId);

    console.log(deleteComment.author.toString(), userId);
    if (deleteComment.author.toString() !== userId) {
      throw new Error("Not authorized!");
    }

    deleteComment = await Comment.findByIdAndDelete(commentId);
    res.json("Comment has been deleted!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getAllCommentByPostId,
  updateComment,
  deleteComment,
};
