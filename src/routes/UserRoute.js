const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const verifyLogin = require("../middlewares/verifyLogin");

// Route for user registration
router.post("/register", UserController.registerUser);

// Route for user login
router.post("/login", UserController.login);

// Route for user logout
router.post("/logout", UserController.logout);

router.post("/block/:id", UserController.blockUser);
router.post("/un-block/:id", UserController.unBlockUser);

// test verifyLogin success
router.get("/test", verifyLogin, (req, res) => {
  res.json("test");
});

module.exports = router;
