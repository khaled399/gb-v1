const express = require("express");
const router = express.Router();

const {
  createTest,
  getTests,
  getTest,
  updateTest,
  deleteTest,
  getTestsByCategory,
  submitAnswers,
} = require("../controllers/test.controller");

// CRUD Routes
// router.post("/", createTest);
router.get("/", getTests);
router.get("/:id", getTest);
router.get("/category/:categoryId", getTestsByCategory);
// router.put("/:id", updateTest);
router.delete("/:id", deleteTest);
router.post("/:id/submit", submitAnswers);

module.exports = router;
