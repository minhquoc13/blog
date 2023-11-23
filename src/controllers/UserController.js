// controllers/userControllers.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, role, email, mobile, password } = req.body;

    const checkEmailExist = await User.findOne({ email });
    if (checkEmailExist) {
      // Hash the password before saving it
      res.status(404).json({ message: "Your email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      role,
      email,
      mobile,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and the password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate an access token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Generate a refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    // Save the refresh token to the user
    user.refreshToken = refreshToken;
    await user.save();

    // Set the access token as an HttpOnly cookie
    res.cookie("access_token", accessToken, { httpOnly: true });

    // Respond with the access and refresh tokens
    res.json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Remove the refresh token from the user
    const user = await User.findById(userId);

    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await User.findOneAndUpdate(
      { _id: id, role: "user" },
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
};
const unBlockUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findOneAndUpdate(
      { _id: id, role: "user" },
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, login, logout, blockUser, unBlockUser };
