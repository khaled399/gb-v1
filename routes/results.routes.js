const express = require("express");
const {
  getKidResults,
  getLatestResult,
  getKidTrend,
  getKidDashboard,
} = require("../controllers/results.controller");
const { protectRoute } = require("../controllers/auth.controller");

const router = express.Router();

router.use(protectRoute);

router.get("/:kidId", getKidResults);
router.get("/:kidId/latest", getLatestResult);
router.get("/:kidId/trend", getKidTrend);
router.get("/:kidId/dashboard", getKidDashboard);

module.exports = router;
