const { types } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "User name required"],
      minlength: [3, "User name must have 5 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      minLength: [5, "Email must have 5 characters"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password must be provided"],
      trim: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "employer", "user"],
      default: "user",
    },
    resume: {
      type: String,
      required: function () {
        return this.role === "user";
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeValidation: {
      type: Number,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeValidation: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);