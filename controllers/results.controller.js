const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Kid = require("../models/Kid");
const TestResult = require("../models/TestResult");
//

//desc get all results for a kid
//route GET /api/results/kids/:kidId
//access Private (parent only)
exports.getKidResults = asyncHandler(async (req, res, next) => {
  const { kidId } = req.params;

  // 1️⃣ تأكد إن الطفل تابع للأب
  const kid = await Kid.findOne({
    _id: kidId,
    parent_ref: req.user._id,
  });

  if (!kid) {
    return next(new ApiError("Kid not found or not authorized", 403));
  }

  // 2️⃣ Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const results = await TestResult.find({ kid_ref: kidId })
    .populate("test", "name_en name_ar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await TestResult.countDocuments({ kid_ref: kidId });

  //hiding the answers details to make the response lighter
  results.forEach((r) => {
    r.answers = undefined;
  });

  res.status(200).json({
    status: "success",
    page,
    results: results.length,
    totalResults: total,
    data: results,
  });
});

// desc get latest result for a kid
// route GET /api/results/kids/:kidId/latest
// access Private (parent only)
exports.getLatestResult = asyncHandler(async (req, res, next) => {
  const { kidId } = req.params;

  const kid = await Kid.findOne({
    _id: kidId,
    parent_ref: req.user._id,
  });

  if (!kid) {
    return next(new ApiError("Kid not found or not authorized", 403));
  }

  const latest = await TestResult.findOne({ kid_ref: kidId })
    .populate("test", "name_en name_ar")
    .sort({ createdAt: -1 });

  if (!latest) {
    return next(new ApiError("No results found", 404));
  }

  res.status(200).json({
    status: "success",
    data: latest,
  });
});

// desc get trend of results for a kid
// route GET /api/results/kids/:kidId/trend
// access Private (parent only)
exports.getKidTrend = asyncHandler(async (req, res, next) => {
  const { kidId } = req.params;

  const kid = await Kid.findOne({
    _id: kidId,
    parent_ref: req.user._id,
  });

  if (!kid) {
    return next(new ApiError("Kid not found or not authorized", 403));
  }

  const results = await TestResult.find({ kid_ref: kidId })
    .sort({ createdAt: 1 })
    .select("percentage createdAt");

  const trend = results.map((r) => ({
    date: r.createdAt,
    percentage: r.percentage,
  }));

  res.status(200).json({
    status: "success",
    trend,
  });
});

// desc get dashboard stats for a kid
// route GET /api/results/kids/:kidId/dashboard
// access Private (parent only)
exports.getKidDashboard = asyncHandler(async (req, res, next) => {
  const { kidId } = req.params;

  // 1️⃣ تأكد إن الطفل تابع للأب
  const kid = await Kid.findOne({
    _id: kidId,
    parent_ref: req.user._id,
  });

  if (!kid) {
    return next(new ApiError("Kid not found or not authorized", 403));
  }

  // 2️⃣ Aggregation
  const stats = await TestResult.aggregate([
    {
      $match: { kid_ref: kid._id },
    },
    {
      $group: {
        _id: null,
        totalTests: { $sum: 1 },
        avgPercentage: { $avg: "$percentage" },
        highestPercentage: { $max: "$percentage" },
        lowestPercentage: { $min: "$percentage" },
      },
    },
  ]);

  // 3️⃣ هات آخر نتيجة عشان نجيب المستوى الحالي
  const latest = await TestResult.findOne({ kid_ref: kid._id })
    .sort({ createdAt: -1 })
    .select("level");

  if (!stats.length) {
    return res.status(200).json({
      status: "success",
      data: {
        totalTests: 0,
        avgPercentage: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        latestLevel: null,
      },
    });
  }

  const dashboard = {
    totalTests: stats[0].totalTests,
    avgPercentage: Math.round(stats[0].avgPercentage),
    highestPercentage: stats[0].highestPercentage,
    lowestPercentage: stats[0].lowestPercentage,
    latestLevel: latest ? latest.level : null,
  };

  res.status(200).json({
    status: "success",
    data: dashboard,
  });
});

// desc get dashboard stats for parent kids
// route GET /api/results/parents/dashboard
// access Private (parent only)
exports.getParentDashboard = asyncHandler(async (req, res, next) => {
  // 1️⃣ هات كل أطفال الأب
  const kids = await Kid.find({ parent_ref: req.user._id });

  if (!kids.length) {
    return res.status(200).json({
      status: "success",
      kids: [],
    });
  }

  const kidsIds = kids.map((k) => k._id);

  // 2️⃣ aggregation لكل الأطفال
  const stats = await TestResult.aggregate([
    {
      $match: { kid_ref: { $in: kidsIds } },
    },
    {
      $group: {
        _id: "$kid_ref",
        totalTests: { $sum: 1 },
        avgPercentage: { $avg: "$percentage" },
        highestPercentage: { $max: "$percentage" },
        lowestPercentage: { $min: "$percentage" },
      },
    },
  ]);

  // 3️⃣ هات latest level لكل طفل
  const latestResults = await TestResult.aggregate([
    {
      $match: { kid_ref: { $in: kidsIds } },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$kid_ref",
        latestLevel: { $first: "$level" },
      },
    },
  ]);

  // 4️⃣ map results مع kids
  const dashboard = kids.map((kid) => {
    const stat = stats.find((s) => s._id.toString() === kid._id.toString());

    const latest = latestResults.find(
      (l) => l._id.toString() === kid._id.toString(),
    );

    return {
      kidId: kid._id,
      name: kid.name,
      totalTests: stat ? stat.totalTests : 0,
      avgPercentage: stat ? Math.round(stat.avgPercentage) : 0,
      highestPercentage: stat ? stat.highestPercentage : 0,
      lowestPercentage: stat ? stat.lowestPercentage : 0,
      latestLevel: latest ? latest.latestLevel : null,
    };
  });

  res.status(200).json({
    status: "success",
    kids: dashboard,
  });
});
