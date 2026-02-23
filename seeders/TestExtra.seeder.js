const Test = require("../models/Test");
const Category = require("../models/Category");

const seedExtraTests = async () => {
  try {
    // get categories by name_en
    const autismCategory = await Category.findOne({
      name_en: "Autism",
    });

    const hyperCategory = await Category.findOne({
      name_en: "Hyperactivity",
    });

    const learningCategory = await Category.findOne({
      name_en: "Learning difficulty",
    });

    if (!autismCategory || !hyperCategory || !learningCategory) {
      throw new Error("One or more categories not found");
    }

    const tests = [
      {
        name_ar: "مقياس كشف التوحد عند الأطفال الكبار",
        name_en: "CARS: Childhood Autism Rating Scale 2",
        type: "Autism",
        desc_ar: "اختبار قياس التوحد عند الاطفال",
        desc_en: "Test to measure autism in children",
        category_id: autismCategory._id,
      },
      {
        name_ar: "إعداد: أ. نعيمة الوهيب - اختبار فرط الحركة وتشتت الانتباه",
        name_en:
          "Prepared by: A. Naima Al-Waheeb - Attention Deficit Hyperactivity Test",
        type: "Hyperactivity",
        desc_ar: "اختبار فرط حركة لدى الأطفال",
        desc_en: "Hyperactivity test in children",
        category_id: hyperCategory._id,
      },
      {
        name_ar: "اختبار المصفوفة المتتابعة الملونة",
        name_en: "Color Progressive Matrix Test (Raven)",
        type: "Learning difficulty",
        desc_ar: "",
        desc_en: "Learning difficulty test in children",
        category_id: learningCategory._id,
      },
    ];

    for (const test of tests) {
      const exists = await Test.findOne({ name_en: test.name_en });
      if (!exists) {
        await Test.create(test);
        console.log(`✅ Added test: ${test.name_en}`);
      } else {
        console.log(`ℹ️ Test already exists: ${test.name_en}`);
      }
    }
  } catch (error) {
    console.error("❌ Error seeding extra tests:", error.message);
  }
};

module.exports = seedExtraTests;
