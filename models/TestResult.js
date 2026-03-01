const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestDetail",
    required: true,
  },
  selectedAnswer: {
    type: mongoose.Schema.Types.ObjectId, // 👈 بدل String
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const testResultSchema = new mongoose.Schema(
  {
    kid_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kid",
      required: true,
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    answers: [answerSchema],
    totalScore: {
      type: Number,
      default: 0,
    },

    maxScore: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
    },

    level: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TestResult", testResultSchema);
