const asyncHandler = require("express-async-handler");
const TestDetail = require("../models/TestDetail");
const ApiError = require("../utils/apiError");

// @desc    Create Test Detail (Question)
// @route   POST /api/test-details
// @access  Public
exports.createTestDetail = asyncHandler(async (req, res, next) => {
  const testDetail = await TestDetail.create(req.body);

  res.status(201).json({
    status: "success",
    data: testDetail,
  });
});

// @desc    Get All Test Details
// @route   GET /api/test-details
// @access  Public
exports.getTestDetails = asyncHandler(async (req, res, next) => {
  const testDetails = await TestDetail.find().populate("test_ref", "name_en");
  // .populate("category_id", "name");

  res.status(200).json({
    status: "success",
    results: testDetails.length,
    data: testDetails,
  });
});

// @desc    Get Single Test Detail
// @route   GET /api/test-details/:id
// @access  Public
exports.getTestDetailById = asyncHandler(async (req, res, next) => {
  const testDetail = await TestDetail.findById(req.params.id).populate(
    "test_ref",
    "name_en",
  );
  // .populate("category_id", "name");

  if (!testDetail) {
    return next(new ApiError("Test detail not found", 404));
  }

  res.status(200).json({
    status: "success",
    type: testDetail.type_en,
    data: testDetail,
  });
});

// @desc    Get Test Details by Test ID
// @route   GET /api/test-details/test/:testId
// @access  Public
exports.getTestDetailsByTestId = asyncHandler(async (req, res, next) => {
  const { testId } = req.params;

  const testDetails = await TestDetail.find({ test_ref: testId })
    .populate("test_ref", "name_en name_ar")
    .populate("category_id", "name_en name_ar");

  if (!testDetails) {
    return next(new ApiError("Test details not found for this test ID", 404));
  }

  if (!testDetails.length) {
    return next(new ApiError("No questions found for this test", 404));
  }

  res.status(200).json({
    status: "success",
    results: testDetails.length,
    testName: testDetails[0].test_ref.name_en,
    data: testDetails,
  });
});

// @desc    Update Test Detail
// @route   PUT /api/test-details/:id
// @access  Public
exports.updateTestDetail = asyncHandler(async (req, res, next) => {
  const testDetail = await TestDetail.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );

  if (!testDetail) {
    return next(new ApiError("Test detail not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: testDetail,
  });
});

// @desc    Delete Test Detail
// @route   DELETE /api/test-details/:id
// @access  Public
exports.deleteTestDetail = asyncHandler(async (req, res, next) => {
  const testDetail = await TestDetail.findByIdAndDelete(req.params.id);

  if (!testDetail) {
    return next(new ApiError("Test detail not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
