const mongoose = require("mongoose");
const testDetailSchema = new mongoose.Schema(
  {
    name_ar: String,
    name_en: { type: String, required: true },

    answers: [
      {
        text_en: String,
        text_ar: String,
        score: Number,
      },
    ],

    type_ar: String,
    type_en: String,

    test_id: Number,

    test_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true },
);

// const testDetailSchema = new mongoose.Schema(
//   {
//     name_ar: { type: String, default: null },
//     name_en: { type: String, required: true },
//     answer1_en: { type: String, default: null },
//     answer1_ar: { type: String, default: null },
//     answer2_en: { type: String, default: null },
//     answer2_ar: { type: String, default: null },
//     answer3_en: { type: String, default: null },
//     answer3_ar: { type: String, default: null },
//     answer4_en: { type: String, default: null },
//     answer4_ar: { type: String, default: null },
//     answer5_en: { type: String, default: null },
//     answer5_ar: { type: String, default: null },
//     answer6_en: { type: String, default: null },
//     answer6_ar: { type: String, default: null },
//     type_ar: { type: String, default: null },
//     type_en: { type: String, default: null },

//     scores: {
//       answer1: { type: Number, default: 0 },
//       answer2: { type: Number, default: 1 },
//       answer3: { type: Number, default: 2 },
//       answer4: { type: Number, default: 3 },
//       answer5: { type: Number, default: 4 },
//       answer6: { type: Number, default: 5 },
//     },

//     test_id: Number, // ✅ مهم
//     test_ref: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Test",
//     },
//     category_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//     },
//   },
//   { timestamps: true },
// );

module.exports = mongoose.model("TestDetail", testDetailSchema);
