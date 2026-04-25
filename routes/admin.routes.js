const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllResults,
} = require("../controllers/admin.controller");

const { protectRoute, allowedTo } = require("../controllers/auth.controller");

router.get("/dashboard", protectRoute, allowedTo("admin"), getAdminDashboard);
router.get("/users", protectRoute, allowedTo("admin"), getAllUsers);
router.delete("/users/:id", protectRoute, allowedTo("admin"), deleteUser);
router.put("/users/:id/role", protectRoute, allowedTo("admin"), updateUserRole);
router.get("/results", protectRoute, allowedTo("admin"), getAllResults);

module.exports = router;
