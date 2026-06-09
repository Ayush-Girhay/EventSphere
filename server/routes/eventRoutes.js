const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const checkRole = require("../middleware/checkRole");

const {
  createEvent,
  getEvents,
  registerEvent,
  deleteEvent,
  updateEvent,
  markAttendance,
} = require("../controllers/eventController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(__dirname, "../uploads")
    );
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
    );
  },
});

const upload = multer({
  storage,
});

// Create Event (Admin Only)
router.post(
  "/",
  auth,
  checkRole(["Admin"]),
  upload.single("poster"),
  createEvent
);

// Get All Events
router.get(
  "/",
  getEvents
);

// Register For Event
router.post(
  "/register/:id",
  auth,
  registerEvent
);

// Update Event (Admin Only)
router.put(
  "/:id",
  auth,
  checkRole(["Admin"]),
  updateEvent
);

// Delete Event (Admin Only)
router.delete(
  "/:id",
  auth,
  checkRole(["Admin"]),
  deleteEvent
);

router.post(
  "/attendance",
  auth,
  checkRole(["Admin"]),
  markAttendance
);

module.exports = router;