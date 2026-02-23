require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Test = require("../models/Test");
const TestDetail = require("../models/TestDetail");

const migrateTestRef = async () => {
  try {
    await connectDB();
    console.log("DB connected");

    const tests = await Test.find({});

    const autismTest = tests.find((t) => t.type === "Autism");
    const hyperTest = tests.find((t) => t.type === "Hyperactivity");
    const learningTest = tests.find((t) => t.type === "Learning difficulty");

    if (!autismTest || !hyperTest || !learningTest) {
      throw new Error("One or more tests not found");
    }

    await TestDetail.updateMany(
      { test_id: { $in: [1, 2] } },
      { $set: { test_ref: autismTest._id } }
    );

    await TestDetail.updateMany(
      { test_id: { $in: [3, 4] } },
      { $set: { test_ref: hyperTest._id } }
    );

    await TestDetail.updateMany(
      { test_id: { $in: [5, 6] } },
      { $set: { test_ref: learningTest._id } }
    );

    console.log("Migration completed successfully ✅");
    process.exit();
  } catch (error) {
    console.error("Migration failed ❌", error);
    process.exit(1);
  }
};

migrateTestRef();
