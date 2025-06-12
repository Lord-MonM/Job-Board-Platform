const { required } = require("joi");
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    firstname: {
      type: String,
      required: [true, "please provide your first name"],
    },
    lastname: {
      type: String,
      required: [true, "please provide last name"],
    },
    email: {
      type: String,
      required: [true, "please provide email"],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resume: {
      type: String,
      required: [true, "Please provide your resume"],
    },
    status: {
      type: String,
      enum: ["applied", "reviewed", "interviewing", "offered", "rejected"],
      default: "applied",
    },
    history: [
      {
        status: String,
        date: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);