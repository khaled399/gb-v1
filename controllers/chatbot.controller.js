const Chat = require("../models/Chat");

const axios = require("axios");
const ApiError = require("../utils/apiError");
const Kid = require("../models/Kid");
const TestResult = require("../models/TestResult");
const { json } = require("express");
const asyncHandler = require("express-async-handler");

const chatbotApiUrl = process.env.CHATBOT_API_URL || "http://localhost:8000";

// Mapping function
const mapCategoryToChatbotType = (categoryName) => {
  switch (categoryName) {
    case "Autism":
      return "Autism";
    case "Hyperactivity":
      return "ADHD";
    case "Learning difficulty":
      return "Behavior Issues";
    default:
      return "Behavior Issues";
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { kidId, message, history } = req.body;

    if (!message) {
      return next(new ApiError("Message is required", 400));
    }

    if (!kidId) {
      return next(new ApiError("kidId is required", 400));
    }

    // 1️⃣ تأكد إن الطفل تابع للأب
    const kid = await Kid.findOne({
      _id: kidId,
      parent_ref: req.user._id,
    });

    if (!kid) {
      return next(new ApiError("Kid not found or not authorized", 403));
    }

    // 2️⃣ هات آخر نتيجة + test + category
    const latestResult = await TestResult.findOne({
      kid_ref: kidId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "test",
        populate: {
          path: "category_id",
          select: "name_en",
        },
      });

    if (!latestResult) {
      return next(
        new ApiError("Please complete a test before using chatbot", 400),
      );
    }

    // 3️⃣ هات اسم الكاتيجوري
    const categoryName = latestResult.test?.category_id?.name_en || "";

    // 4️⃣ build child_data
    const mappedChildData = {
      child_name: kid.name,
      age: kid.age,
      test_type: mapCategoryToChatbotType(categoryName),
      score: latestResult.percentage || 0,
    };
    let chat = await Chat.findOne({ kid_ref: kidId });

    if (!chat) {
      chat = await Chat.create({
        kid_ref: kidId,
        messages: [],
      });
    }
    const historyForBot = chat.messages.map((msg) => ({
      role: msg.role === "bot" ? "assistant" : "user",
      content: msg.text,
    }));

    // 5️⃣ Call Python chatbot
    const response = await axios.post(`${chatbotApiUrl}/api/v1/chat`, {
      child_data: mappedChildData,
      message,
      history: historyForBot || [],
    });
    // 6️⃣ Save user message and bot response to DB
    const botReply = response.data;
    chat.messages.push({ role: "user", text: message });

    // Log the bot reply for debugging
    // console.log("Bot reply:", JSON.stringify(botReply, null, 2));

    // Extract bot text based on response type
    let botText = "No response";

    // Try to extract text from different response formats
    if (botReply?.type === "error") {
      // Error response from Python service
      botText = `Error: ${botReply?.message || "Unknown error"}`;
      console.error("Chatbot error:", botText);
    } else if (botReply?.type === "text") {
      // Plain text fallback response
      botText = botReply?.message || "No response";
    } else if (botReply?.type === "mixed") {
      // Mixed response: reassurance + guidance
      let parts = [];
      if (botReply?.reassurance) {
        parts.push(botReply.reassurance);
      }
      if (botReply?.guidance?.solutions?.length) {
        parts.push(botReply.guidance.solutions.join("\n"));
      }
      botText = parts.filter((p) => p).join("\n\n");
    } else if (botReply?.type === "reassurance") {
      // Reassurance only
      botText = botReply?.message || botReply?.reassurance || "No response";
    } else if (botReply?.type === "guidance") {
      // Guidance only
      let parts = [];
      if (botReply?.reason) {
        parts.push(botReply.reason);
      }
      if (botReply?.solutions?.length) {
        parts.push(botReply.solutions.join("\n"));
      }
      botText = parts.filter((p) => p).join("\n\n");
    } else if (botReply?.type === "info") {
      // Information response
      botText = botReply?.explanation || "No response";
    } else {
      // Fallback to checking individual fields
      if (botReply?.solutions?.length) {
        botText = botReply.solutions.join("\n");
      } else if (botReply?.guidance?.solutions?.length) {
        botText = botReply.guidance.solutions.join("\n");
      } else if (botReply?.reassurance) {
        botText = botReply.reassurance;
      } else if (botReply?.message) {
        botText = botReply.message;
      } else if (botReply?.reason) {
        botText = botReply.reason;
      } else if (botReply?.explanation) {
        botText = botReply.explanation;
      }
    }

    chat.messages.push({
      role: "bot",
      text: botText || "No response",
    });
    await chat.save();

    res.status(200).json({
      status: "success",
      data: response.data,
    });
  } catch (error) {
    if (error.response) {
      let errorMessage = "Chatbot service error";

      if (error.response.data) {
        if (typeof error.response.data.detail === "string") {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail
            .map((err) => (typeof err === "string" ? err : JSON.stringify(err)))
            .join("; ");
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      return next(new ApiError(errorMessage, error.response.status));
    } else if (error.code === "ECONNREFUSED") {
      return next(
        new ApiError(
          "Chatbot service is unavailable. Please try again later.",
          503,
        ),
      );
    } else {
      return next(new ApiError(error.message, 500));
    }
  }
};

exports.getChat = asyncHandler(async (req, res, next) => {
  const { kidId } = req.params;

  const chat = await Chat.findOne({ kid_ref: kidId });

  if (!chat) {
    return res.status(200).json({
      status: "success",
      messages: [],
    });
  }

  res.status(200).json({
    status: "success",
    messages: chat.messages,
  });
});
