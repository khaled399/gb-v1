const Test = require("../models/Test");
const Category = require("../models/Category");

const testSeeder = async () => {
  await Test.deleteMany();

  const autismCategory = await Category.findOne({ name_en: "Autism" });
  const hyperCategory = await Category.findOne({ name_en: "Hyperactivity" });
  const learningCategory = await Category.findOne({
    name_en: "Learning difficulty",
  });

  await Test.create([
    {
      name_ar: "جليام",
      name_en: "Gilliam",
      type: "Autism",
      desc_ar: "اختبار جليام لقياس التوحد عند الاطفال",
      desc_en: "Gilliam test to measure autism in children",
      category_id: autismCategory._id,
    },
    {
      name_ar: "اختبار فرط الحركة",
      name_en: "Hyperactivity Test",
      type: "Hyperactivity",
      desc_ar: "اختبار فرط حركه لدى الاطفال",
      desc_en: "Hyperactivity test in children",
      category_id: hyperCategory._id,
    },
    {
      name_ar: "اختبار صعوبات التعلم",
      name_en: "Learning Difficulty Test",
      type: "Learning difficulty",
      desc_en: "Learning difficulty test in children",
      category_id: learningCategory._id,
    },
  ]);

  console.log("Tests seeded ✅");
};

module.exports = testSeeder;
