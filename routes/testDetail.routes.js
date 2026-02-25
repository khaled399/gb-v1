const express = require("express");
const router = express.Router();

const {
  createTestDetail,
  getTestDetails,
  getTestDetailById,
  updateTestDetail,
  deleteTestDetail,
  getTestDetailsByTestId,
} = require("../controllers/testDetail.controller");

const { protectRoute, allowedTo } = require("../controllers/auth.controller");

// router.use(protectRoute);
// router.use(allowedTo("admin", "teacher"));

router.post("/", createTestDetail);
router.get("/", getTestDetails);
router.get("/test/:testId", protectRoute, getTestDetailsByTestId);
router.get("/:id", getTestDetailById);
router.put("/:id", updateTestDetail);
router.delete("/:id", deleteTestDetail);

module.exports = router;
