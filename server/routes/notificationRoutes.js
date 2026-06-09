const express = require("express");
const auth = require("../middleware/auth");

const {
  getNotifications,
  getUnreadCount,
  markAllRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.get(
  "/",
  auth,
  getNotifications
);

router.get(
  "/count",
  auth,
  getUnreadCount
);

router.put(
  "/read",
  auth,
  markAllRead
);

module.exports = router;