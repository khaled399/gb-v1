const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("Please provide email and password", 400));
  }

  // 2. Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ApiError("Invalid email or password", 401));
  }
  // 3. Check if password is correct
  const isPasswordCorrect = await user.correctPassword(password);
  if (!isPasswordCorrect) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Protect routes

exports.protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  // 1. التوكن موجود في الهيدر؟
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("You are not logged in, token is missing", 401));
  }

  // 2. تحقق من صحة التوكن
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new ApiError("Invalid token or expired", 401));
  }

  // 3. تأكد إن المستخدم لا يزال موجود
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new ApiError("User no longer exists", 401));
  }

  // 4. أضف المستخدم للطلب للي بعده
  req.user = currentUser;
  next();
});

// @desc    Restrict access to specific roles

exports.allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to do this operation", 403),
      );
    }
    next();
  };
};
