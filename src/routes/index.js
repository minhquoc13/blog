const express = require("express");
const userRoutes = require("./UserRoute");
const postRoutes = require("./PostRoute");
const commentRoutes = require("./CommentRoute");

const router = express.Router();

router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/comment", commentRoutes);

module.exports = router;
