const TestResult = require("../models/TestResult");
const Kid = require("../models/Kid");
const calculateScore = require("../services/scoring.service");

exports.submitTest = async (req, res) => {
  try {
    const { testId, answers, kidId } = req.body;
    // Validate kid existence
    // 1️⃣ تأكد إن الطفل تابع للأب
    const kid = await Kid.findOne({
      _id: kidId,
      parent_ref: req.user._id,
    });

    if (!kid) {
      return next(new ApiError("Kid not found or not authorized", 403));
    }
    const { processedAnswers, totalScore } = await calculateScore(answers);

    // const level = getResultLevel(totalScore, answers.length * 3); // Assuming max score per question is 3

    const result = await TestResult.create({
      kid_ref: kidId,
      test: testId,
      answers: processedAnswers,
      // level,
      totalScore,
    });

    res.status(201).json({
      message: "Test submitted successfully",
      totalScore,
      // level,
      resultId: result._id,
      kid_ref: kidId,
    });
  } catch (error) {
    console.error("Error submitting test:", error);
    res
      .status(500)
      .json({ message: "Failed to submit test", error: error.message });
  }
};
