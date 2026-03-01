const express = require("express");
const router = express.Router();

const { submitTest } = require("../controllers/testResult.controller");

const { protectRoute } = require("../controllers/auth.controller");

// Submit test answers
router.post("/submit", protectRoute, submitTest);

module.exports = router;
