require("dotenv").config();
const connectDB = require("../config/db");
const extraTestSeeder = require("./TestExtra.seeder");

const run = async () => {
  await connectDB();
  console.log("🌱 Seeding extra tests...");
  await extraTestSeeder();
  console.log("✅ Extra tests seeded");
  process.exit();
};

run();
