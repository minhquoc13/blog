const router = require("express").Router();
const commentController = require("../controllers/CommentController");
const { verifyLogin } = require("../middlewares/authMiddleware");

router.get("/:postId", commentController.getAllCommentByPostId);
router.post("/:postId", verifyLogin, commentController.createComment);
router.patch("/:commentId", verifyLogin, commentController.updateComment);
router.delete("/:commentId", verifyLogin, commentController.deleteComment);

module.exports = router;
