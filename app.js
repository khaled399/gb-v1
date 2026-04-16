const express = require("express");
const morgan = require("morgan");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

// Route files
const authRoutes = require("./routes/auth.routes");

const categoryRoutes = require("./routes/categoryroutes");
const testRoutes = require("./routes/test.routes");
const testDetailRoutes = require("./routes/testDetail.routes");
const userRoutes = require("./routes/User.routes");
const testResultRoutes = require("./routes/testResult.routes");
const kidRoutes = require("./routes/kid.routes");
const resultsRoutes = require("./routes/results.routes");
const chatbotRoutes = require("./routes/chatbot.routes");

const app = express();

// Middlewares
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 🔹 Routes (هنضيفهم بعدين)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/tests", testRoutes);
app.use("/api/v1/test-details", testDetailRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/test-results", testResultRoutes);
app.use("/api/v1/kids", kidRoutes);
app.use("/api/v1/results", resultsRoutes);
app.use("/api/v1/chat", chatbotRoutes);

//  Handle undefined routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

//  Global error handling middleware
app.use(globalError);

module.exports = app;
