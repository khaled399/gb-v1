const express = require("express");
const { sendMessage, getChat } = require("../controllers/chatbot.controller");
const { protectRoute } = require("../controllers/auth.controller");

const router = express.Router();

// POST: Send message to chatbot
router.post("/", protectRoute, sendMessage);
// GET: Get chat history for a kid
router.get("/:kidId", protectRoute, getChat);

module.exports = router;
