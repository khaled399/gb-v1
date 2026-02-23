const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    name_ar: String,
    name_en: String,
    type: String,
    desc_ar: String,
    desc_en: String,

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
