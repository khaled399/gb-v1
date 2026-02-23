const asyncHandler = require("express-async-handler");
const Test = require("../models/Test");
const ApiError = require("../utils/apiError");
const calculateScore = require("../utils/calculateScore");
const getResultLevel = require("../utils/getResultLevel");
// @desc    Create new test
// @route   POST /api/tests
// @access  Admin (later)
exports.createTest = asyncHandler(async (req, res) => {
  const { name, type, description } = req.body;

  if (!name || !type) {
    res.status(400);
    throw new Error("Name and type are required");
  }

  const test = await Test.create({
    name,
    type, // autism | adhd | learning
    description,
  });

  res.status(201).json({
    success: true,
    data: test,
  });
});

// @desc    Get all tests
// @route   GET /api/tests
// @access  Public
exports.getTests = asyncHandler(async (req, res) => {
  const tests = await Test.find();

  res.status(200).json({
    results: tests.length,
    data: tests,
  });
});
// @desc    Get single test by id
// @route   GET /api/tests/:id
// @access  Public
exports.getTest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const test = await Test.findById(id);
  if (!test) {
    return next(new ApiError("Test not found", 404));
  }
  res.status(200).json({
    data: test,
  });
});
// @desc    Get Tests by Category
// @route   GET /api/tests/category/:categoryId
// @access  Public
exports.getTestsByCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const tests = await Test.find({ category_id: categoryId }).populate(
    "category_id",
    "name_en name_ar",
  );

  if (!tests) {
    return next(new ApiError("Tests not found for this category", 404));
  }

  if (!tests.length) {
    return next(new ApiError("No tests found for this category", 404));
  }

  res.status(200).json({
    status: "success",
    results: tests.length,
    categoryName: tests[0].category_id.name_en,
    data: tests,
  });
});

// @desc    Delete test
// @route   DELETE /api/tests/:id
// @access  Admin
exports.deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  await test.deleteOne();

  res.status(200).json({
    success: true,
    message: "Test removed",
  });
});

// @desc    Submit answers and get result
// @route   POST /api/tests/submit
// @access  Public

exports.submitAnswers = asyncHandler(async (req, res, next) => {
  const testId = req.params.id;
  const { answers } = req.body;
  if (!testId || !Array.isArray(answers)) {
    return next(new ApiError("Invalid payload", 400));
  }

  // 1️⃣ total score
  const totalScore = calculateScore(answers);

  // 2️⃣ max score (مثال: 3 لكل سؤال)
  const maxScore = answers.length * 3;

  // 3️⃣ level
  const level = getResultLevel(totalScore, maxScore);

  res.status(200).json({
    status: "success",
    data: {
      testId,
      totalScore,
      maxScore,
      level,
    },
  });
});
