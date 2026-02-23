const express = require("express");
const router = express.Router();

const { submitTest } = require("../controllers/testResult.controller");

// Submit test answers
router.post("/submit", submitTest);

module.exports = router;
