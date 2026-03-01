const Kid = require("../models/Kid");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

// @desc Add new kid
// @route POST /api/v1/kids
// @access Private (Parent)
exports.createKid = asyncHandler(async (req, res, next) => {
  const { name, age, gender } = req.body;

  const kid = await Kid.create({
    name,
    age,
    gender,
    parent_ref: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: kid,
  });
});

// @desc Get all kids for logged in parent
// @route GET /api/v1/kids
// @access Private
exports.getMyKids = asyncHandler(async (req, res, next) => {
  const kids = await Kid.find({ parent_ref: req.user._id });

  res.status(200).json({
    status: "success",
    results: kids.length,
    data: kids,
  });
});
//Ownership Validation
// dec Get specific kid by ID
// route GET /api/v1/kids/:id
// access Private (Parent)
exports.getKidById = asyncHandler(async (req, res, next) => {
  const kid = await Kid.findOne({
    _id: req.params.id,
    parent_ref: req.user._id,
  });

  // 1️⃣ تأكد إن الطفل تابع للأب
  if (!kid) {
    return next(new ApiError("Kid not found or not authorized", 403));
  }

  res.status(200).json({
    status: "success",
    data: kid,
  });
});

// @desc Update kid by ID
// @route PUT /api/v1/kids/:id
// @access Private (Parent)
exports.updateKid = asyncHandler(async (req, res, next) => {
  const kid = await Kid.findOneAndUpdate(
    { _id: req.params.id, parent_ref: req.user._id },
    req.body,
    { new: true, runValidators: true },
  );

  if (!kid) {
    return next(new ApiError("Kid not found or not authorized", 403));
  }

  res.status(200).json({
    status: "success",
    data: kid,
  });
});

// @desc Delete kid by ID
// @route DELETE /api/v1/kids/:id
// @access Private (Parent)
exports.deleteKid = asyncHandler(async (req, res, next) => {
  const kid = await Kid.findOneAndDelete({
    _id: req.params.id,
    parent_ref: req.user._id,
  });

  if (!kid) {
    return next(new ApiError("Kid not found or not authorized", 403));
  }

  res.status(204).send();
});
