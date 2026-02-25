const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔥 مهم جدا
    },

    role: {
      type: String,
      enum: ["parent", "admin"],
      default: "parent",
    },
  },
  { timestamps: true },
);

// Hash password before saving
// Hash password before save
userSchema.pre("save", async function (next) {
  // console.log("Pre-save hook triggered for user:", this.email);
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
// Compare entered password with hashed password
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
