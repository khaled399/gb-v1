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

router.post("/", createTestDetail);
router.get("/", getTestDetails);
router.get("/test/:testId", getTestDetailsByTestId);
router.get("/:id", getTestDetailById);
router.put("/:id", updateTestDetail);
router.delete("/:id", deleteTestDetail);

module.exports = router;
