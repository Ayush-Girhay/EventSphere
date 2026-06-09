const express = require("express");

const auth =
  require("../middleware/auth");

const upload =
  require("../middleware/upload");

const {
  getProfile,
  getRegisteredEvents,
  uploadProfilePhoto,
} = require(
  "../controllers/userController"
);

const router =
  express.Router();

router.get(
  "/profile",
  auth,
  getProfile
);

router.get(
  "/registrations",
  auth,
  getRegisteredEvents
);

router.post(
  "/profile-photo",
  auth,
  upload.single("image"),
  uploadProfilePhoto
);

module.exports = router;