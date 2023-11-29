const router = require("express").Router();
const commentController = require("../controllers/CommentController");
const { verifyLogin } = require("../middlewares/authMiddleware");

router.post("/:id", verifyLogin, commentController.createComment);
router.patch("/:id", verifyLogin, commentController.updateComment);
router.delete("/:id", verifyLogin, commentController.deleteComment);

module.exports = router;
