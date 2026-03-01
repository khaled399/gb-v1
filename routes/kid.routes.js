const express = require("express");
const router = express.Router();

const {
  createKid,
  getMyKids,
  getKidById,
  updateKid,
  deleteKid,
} = require("../controllers/kid.controller");

const { protectRoute } = require("../controllers/auth.controller");

router.use(protectRoute);

router.route("/").post(createKid).get(getMyKids);

router.route("/:id").get(getKidById).patch(updateKid).delete(deleteKid);

module.exports = router;
