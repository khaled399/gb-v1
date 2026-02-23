require("dotenv").config();
const connectDB = require("../config/db");

const Test = require("../models/Test");
const TestDetail = require("../models/TestDetail");

const runMigration = async () => {
  await connectDB();
  console.log("🚀 Migration started...");

  // build mapping explicitly
  const testMap = {
    1: await Test.findOne({ name_en: "CARS: Childhood Autism Rating Scale 2" }),
    2: await Test.findOne({ name_en: "Gilliam" }),
    3: await Test.findOne({
      name_en:
        "Prepared by: A. Naima Al-Waheeb - Attention Deficit Hyperactivity Test",
    }),
    4: await Test.findOne({ name_en: "Hyperactivity Test" }),

    5: await Test.findOne({
      name_en: "Color Progressive Matrix Test (Raven)",
    }),
    6: await Test.findOne({ name_en: "Learning Difficulty Test" }),
  };

  // safety check
  for (const [key, test] of Object.entries(testMap)) {
    if (!test) {
      console.error(`❌ Test not found for test_id ${key}`);
      process.exit(1);
    }
  }

  // migrate
  const details = await TestDetail.find();

  for (const d of details) {
    const test = testMap[d.test_id];
    if (test) {
      d.test_ref = test._id;
      await d.save();
    }
  }

  console.log("✅ Migration finished successfully");
  process.exit();
};

runMigration();
