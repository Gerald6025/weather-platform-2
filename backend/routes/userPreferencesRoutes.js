const express = require("express");
const router = express.Router();
const UserPreferences = require("../models/userPreferences");
const { asyncHandler } = require("../middleware/errorHandler");

// GET PREFERENCES
router.get("/", asyncHandler(async (req, res) => {
  const preferences = await UserPreferences.getPreferences();
  res.json(preferences);
}));

// UPDATE PREFERENCES
router.put("/", asyncHandler(async (req, res) => {
  const preferences = await UserPreferences.getPreferences();
  const updated = await UserPreferences.findByIdAndUpdate(
    preferences._id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(updated);
}));

module.exports = router;
