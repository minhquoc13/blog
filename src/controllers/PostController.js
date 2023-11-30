const Post = require("../models/PostModel");

const createPost = async (req, res, next) => {
  try {
    const { title, desc, content } = req.body;
    const author = req.user.userId;
    const post = await Post.create({ title, desc, content, author });
    res.json({ post });
    next(error);
  } catch (error) {}
};

const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const { title, desc, content } = req.body;

    let updatePost = await Post.findById(postId);

    if(!updatePost ) {
      throw new Error('Post not found')
    }

    if (updatePost.author.toString() !== userId) {
      throw new Error("Not authorized!");
    }
    updatePost = await Post.findByIdAndUpdate(
      postId,
      { title, desc, content },
      { new: true }
    );
    res.json(updatePost);
  } catch (error) {
    next(error);
  }
};

const archivePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    let archivePost = await Post.findById(postId);

    if(!archivePost ) {
      throw new Error('Post not found')
    }

    if (archivePost.author.toString() !== userId) {
      throw new Erorr("Not authorized!");
    }

    archivePost = await Post.findByIdAndUpdate(
      postId,
      {
        isArchived: true,
      },
      { new: true }
    );
    res.json(archivePost);
  } catch (error) {
    next(error);
  }
};

const unArchivePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    let unArchivePost = await Post.findById(postId);

    if(!unArchivePost ) {
      throw new Error('Post not found')
    }

    if (unArchivePost.author.toString() !== userId) {
      throw new Erorr("Not authorized!");
    }

    unArchivePost = await Post.findByIdAndUpdate(
      postId,
      {
        isArchived: false,
      },
      { new: true }
    );
    res.json(unArchivePost);
  } catch (error) {
    next(error);
  }
};

const increaseViewCount = async (postId) => {
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true }
    );
    if(!post) {
      throw new Error('Post not found')
    }
    return post
  } catch (error) {
    throw error;
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    let deletePost = await Post.findById(postId);

    if(!deletePost) {
      throw new Error('Post not found')
    }

    if (deletePost.author.toString() !== userId) {
      throw new Erorr("Not authorized!");
    }

    deletePost = await Post.findByIdAndDelete(postId);
    res.json(deletePost);
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort("-createdAt");
    const postCount = await Post.countDocuments();
    res.json({ posts, postCount });
  } catch (error) {
    next(error);
  }
};

const getAllPostsByAuthor = async (req, res, next) => {
  try {
    const authorId = req.params.id;

    if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }

    const posts = await Post.find({ author: authorId }).sort("-createdAt");

    if(!posts) {
      throw new Error('Post not found')
    }

    const postCount = await Post.countDocuments({ author: authorId });

    res.json({ posts, postCount });
  } catch (error) {
    next(error);
  }
};

const getSinglePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if(!post) {
      throw new Error('Post not found')
    } 

    await increaseViewCount(postId);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const deleteMultiplePosts = async (req, res, next) => {
  try {
    const { postIds } = req.body;

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or missing postIds array" });
    }

    const deletedPosts = await Post.deleteMany({
      _id: { $in: postIds, isArchive: true },
    });

    if (deletedPosts.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No matching posts found for deletion" });
    }

    res.json({
      message: "Posts deleted successfully",
      deletedCount: deletedPosts.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  archivePost,
  unArchivePost,
  deleteMultiplePosts,
  getAllPosts,
  getAllPostsByAuthor,
  getSinglePost,
};
