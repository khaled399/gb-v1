require("dotenv").config();
const connectDB = require("../config/db");

// const categorySeeder = require("./Category.seeder");
// const testSeeder = require("./Test.seeder");
const testDetailSeeder = require("./TestDetail.seeder");

const runSeeders = async () => {
  await connectDB();

  console.log("Seeding started...");

  // await categorySeeder();
  // await testSeeder();
  await testDetailSeeder();

  console.log("All seeders finished 🌱");
  process.exit();
};

runSeeders();
