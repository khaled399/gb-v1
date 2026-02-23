const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const ApiError = require("../utils/apiError");

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).json({
    results: categories.length,
    data: categories,
  });
});

// @desc    Get single category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    return next(new ApiError("Category not found", 404));
  }

  res.status(200).json({
    data: category,
  });
});
