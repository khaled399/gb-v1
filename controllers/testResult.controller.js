const TestResult = require("../models/TestResult");
const calculateScore = require("../services/scoring.service");

exports.submitTest = async (req, res) => {
  try {
    const { testId, answers, userId } = req.body;
    //   const userId = req.user._id; // من auth middleware

    const { processedAnswers, totalScore } = await calculateScore(answers);

    const result = await TestResult.create({
      user: userId,
      test: testId,
      answers: processedAnswers,
      totalScore,
    });

    res.status(201).json({
      message: "Test submitted successfully",
      totalScore,
      resultId: result._id,
      user: userId,
    });
  } catch (error) {
    console.error("Error submitting test:", error);
    res
      .status(500)
      .json({ message: "Failed to submit test", error: error.message });
  }
};
