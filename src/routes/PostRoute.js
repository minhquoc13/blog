const router = require("express").Router();
const postController = require("../controllers/PostController");
const { isAdmin, verifyLogin } = require("../middlewares/authMiddleware");

router.get("/", postController.getAllPosts);
router.get("/author/:id", verifyLogin, postController.getAllPostsByAuthor);
router.get("/:id", postController.getSinglePost);
router.post("/", verifyLogin, postController.createPost);
router.patch("/archive/:id", verifyLogin, postController.archivePost);
router.patch("/unarchive/:id", verifyLogin, postController.unArchivePost);
router.patch("/:id", verifyLogin, postController.updatePost);
router.delete("/:id", verifyLogin, postController.deletePost);

module.exports = router;
