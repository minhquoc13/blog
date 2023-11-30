// models/User.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true
    },
    firstName: { type: String, required: true },
    role: { type: String, default: "user" },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: { type: String },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    refreshToken: { type: String },
    passwordResetExpired: { type: Date },
    passwordResetToken: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
