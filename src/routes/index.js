// routes/index.js

const express = require("express");
const userRoutes = require("./UserRoute"); // Import other route files as needed

const router = express.Router();

router.use("/api/user", userRoutes);

module.exports = router;
