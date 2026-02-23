const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = require("./app");

// DB
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
