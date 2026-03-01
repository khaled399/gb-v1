const Kid = require("../models/Kid");
const Test = require("../models/Test");
const TestResult = require("../models/TestResult");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const calculateScore = require("../services/scoring.service");
const TestDetail = require("../models/TestDetail");

exports.submitTest = asyncHandler(async (req, res, next) => {
  const { testId, answers: submittedAnswers, kidId } = req.body;

  // 1️⃣ تأكد إن الأب عنده أطفال
  const kidsCount = await Kid.countDocuments({
    parent_ref: req.user._id,
  });

  if (kidsCount === 0) {
    return next(new ApiError("You must add a child before taking a test", 400));
  }

  // 2️⃣ تأكد إن الطفل تابع للأب
  const kid = await Kid.findOne({
    _id: kidId,
    parent_ref: req.user._id,
  });

  if (!kid) {
    return next(new ApiError("Kid not found or not authorized", 403));
  }

  // 3️⃣ تأكد إن التست موجود
  const test = await Test.findById(testId);
  if (!test) {
    return next(new ApiError("Test not found", 404));
  }

  // 4️⃣ هات كل الأسئلة مرة واحدة
  const questions = await TestDetail.find({
    test_ref: testId,
    _id: { $in: submittedAnswers.map((a) => a.questionId) },
  });

  let totalScore = 0;
  const formattedAnswers = [];

  for (const ans of submittedAnswers) {
    const question = questions.find((q) => q._id.toString() === ans.questionId);

    if (!question) continue;

    const selected = question.answers.find(
      (a) => a._id.toString() === ans.selectedAnswer,
    );

    if (!selected) continue;

    totalScore += selected.score;
    formattedAnswers.push({
      question: question._id,
      selectedAnswer: selected._id,
      score: selected.score,
    });
  }

  // 6️⃣ احسب maxScore
  let maxScore = 0;

  for (const question of questions) {
    const highest = Math.max(...question.answers.map((a) => a.score));
    maxScore += highest;
  }

  // 7️⃣ احسب percentage
  const percentage = Math.round((totalScore / maxScore) * 100) || 0;

  // 8️⃣ Level Mapping
  let level;

  if (percentage >= 70) level = "High";
  else if (percentage >= 40) level = "Medium";
  else level = "Low";

  // 9️⃣ Interpretation
  let interpretation;

  if (level === "High") {
    interpretation =
      "High level of symptoms. Professional evaluation is recommended.";
  } else if (level === "Medium") {
    interpretation = "Moderate symptoms observed. Monitoring is advised.";
  } else {
    interpretation = "Low level of symptoms.";
  }

  // 5️⃣ خزّن النتيجة بالشكل الصح
  const result = await TestResult.create({
    kid_ref: kidId,
    test: testId,
    answers: formattedAnswers,
    totalScore,
    maxScore,
    percentage,
    level,
  });

  res.status(201).json({
    status: "success",
    data: {
      totalScore,
      maxScore,
      percentage,
      level,
      interpretation,
      submittedAt: result.createdAt,
    },
  });
});
