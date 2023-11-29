const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { verifyLogin, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.delete("/:id", verifyLogin, UserController.deleteUser);
router.patch("/unblock/:id", verifyLogin, isAdmin, UserController.unBlockUser);
router.patch("/block/:id", verifyLogin, isAdmin, UserController.blockUser);
router.patch("/:id", verifyLogin, UserController.updateUser);
router.post("/register", UserController.registerUser);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);

router.get("/test", verifyLogin, isAdmin, (req, res) => {
  res.json("test");
});

module.exports = router;
