const mongoose = require("mongoose");

const kidSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
      max: 18,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    parent_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Kid", kidSchema);
