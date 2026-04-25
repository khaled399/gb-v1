const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Kid = require("../models/Kid");
const ApiError = require("../utils/apiError");
const TestResult = require("../models/TestResult");

exports.getAdminDashboard = asyncHandler(async (req, res, next) => {
  // 1️⃣ Basic counts
  const totalUsers = await User.countDocuments();
  const totalKids = await Kid.countDocuments();
  const totalResults = await TestResult.countDocuments();

  // 2️⃣ Aggregation on results
  const stats = await TestResult.aggregate([
    {
      $group: {
        _id: null,
        avgScore: { $avg: "$percentage" },
        highCases: {
          $sum: {
            $cond: [{ $eq: ["$level", "High"] }, 1, 0],
          },
        },
        mediumCases: {
          $sum: {
            $cond: [{ $eq: ["$level", "Medium"] }, 1, 0],
          },
        },
        lowCases: {
          $sum: {
            $cond: [{ $eq: ["$level", "Low"] }, 1, 0],
          },
        },
      },
    },
  ]);

  const dashboard = {
    totalUsers,
    totalKids,
    totalResults,
    avgScore: stats[0]?.avgScore ? Math.round(stats[0].avgScore) : 0,
    highCases: stats[0]?.highCases || 0,
    mediumCases: stats[0]?.mediumCases || 0,
    lowCases: stats[0]?.lowCases || 0,
  };

  res.status(200).json({
    status: "success",
    data: dashboard,
  });
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().sort("-createdAt").select("-password");

  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(204).json({
    status: "success",
  });
});

//update user role (admin or user)
//api/v1/admin/users/:id
//protectRoute, allowedTo("admin") in route definition

exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  if (!["parent", "admin"].includes(role)) {
    return next(new ApiError("Role must be either 'parent' or 'admin'", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true },
  ).select("-password");
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

const { simplifyTestName } = require("../utils/simplifyTestName");
exports.getAllResults = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, level, testId } = req.query;

  const filter = {};
  if (level) filter.level = level;
  if (testId) filter.test = testId;

  const skip = (page - 1) * limit;

  const results = await TestResult.find(filter)
    .populate("kid_ref", "name age")
    .populate("test", "name_en")
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit));

  const total = await TestResult.countDocuments(filter);

  // 🔥 هنا السحر
  const formatted = results.map((r) => ({
    id: r._id,

    kid: {
      name: r.kid_ref?.name,
      age: r.kid_ref?.age,
    },

    test: simplifyTestName(r.test?.name_en),

    score: {
      total: r.totalScore,
      max: r.maxScore,
      percentage: r.percentage,
    },

    level: r.level,

    date: r.createdAt.toISOString().split("T")[0],
  }));

  res.status(200).json({
    status: "success",
    meta: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
    data: formatted,
  });
});
