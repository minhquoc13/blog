const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const registerUser = async (req, res, next) => {
  try {
    const { userName, firstName, lastName, email, mobile, password } = req.body;

    const checkUserNameExist = await User.findOne({ userName });
    if (checkUserNameExist) {
      res.status(404).json({ message: "Your username already exists" });
    }

    const checkEmailExist = await User.findOne({ email });
    if (checkEmailExist) {
      res.status(404).json({ message: "Your email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userName,
      firstName,
      lastName,
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
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res.status(401).json({ message: "User has been blocked!" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
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
    res.cookie("token", accessToken, { httpOnly: true });

    // Respond with the access and refresh tokens
    res.json({ accessToken, refreshToken });
  } catch (error) {
    // req.clearCookie("token");
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

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const blockUser = await User.findByIdAndUpdate(
      userId,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json(blockUser);
  } catch (error) {
    next(error);
  }
};
const unBlockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const unBlockeUser = await User.findByIdAndUpdate(
      userId,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json(unBlockeUser);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, mobile } = req.body;
    const id = req.params.id;
    const userId = req.user.userId;
    let updateUser = await User.findById(id);

    if (updateUser.id.toString() !== userId) {
      res.json("Not authorized!");
    }

    updateUser = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        mobile,
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    let deleteUser = await User.findById(id);
    if (deleteUser.id.toString() !== userId) {
      res.json("Not authorized!");
    }

    deleteUser = await User.findByIdAndDelete(id);

    res.json(
      `User ${deleteUser.firstName} with id: ${deleteUser._id} has been deleted!`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unBlockUser,
};
