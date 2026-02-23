const User = require("../models/User");

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    message: "User created successfully",
    user,
  });
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    message: "User retrieved successfully",
    user,
  });
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    message: "Users retrieved successfully",
    users,
  });
};
