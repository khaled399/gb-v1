const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name_ar: String,
    name_en: String,
    img: String,
    desc_ar: String,
    desc_en: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
