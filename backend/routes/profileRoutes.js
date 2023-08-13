const express = require("express");
const router = express.Router();
const {
  createProfile,
  getProfiles,
  updateProfile,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createProfile);
router.get("/", protect, getProfiles);

router.route("/:id").put(protect, updateProfile);

module.exports = router;
