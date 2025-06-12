const { required } = require("joi");
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, "Please provide position"],
    },
    description: {
      type: String,
      required: [true, "Please provide job description"],
    },
    company: {
      type: String,
      required: [true, "Please provide company name"],
    },
    location: {
      type: String,
      required: [true, "Please provide location"],
    },
    mode: {
      type: String,
      enum: ["Remote", "Hybrid"],
      required: [true, "Please provide mode"],
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", JobSchema);