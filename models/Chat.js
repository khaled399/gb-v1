const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const chatSchema = new mongoose.Schema(
  {
    kid_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kid",
      required: true,
      unique: true, // كل طفل له شات واحد
    },
    messages: [messageSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Chat", chatSchema);
