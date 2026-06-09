console.log("MEDIA ROUTES LOADED");
const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

const checkRole = require("../middleware/checkRole");

const {
  uploadMedia,
  getMedia,
  likeMedia,
  addFavorite,
  addComment,
  deleteMedia,
  searchMedia,
  getSimilarPhotos,
  getTaggedPhotos,
} = require(
  "../controllers/mediaController"
);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get(
  "/tagged",
  auth,
  getTaggedPhotos
);

// Protected Upload Route
router.post(
  "/upload",
  auth,
  checkRole([
    "Admin",
    "Photographer",
  ]),
  upload.array("images", 10),
  uploadMedia
);
// Get All Media

router.get(
  "/search",
  (req, res, next) => {
    console.log(
      "SEARCH ROUTE HIT"
    );
    next();
  },
  searchMedia
);


router.get(
  "/search",
  searchMedia
);

router.get(
  "/similar/:id",
  getSimilarPhotos
);

router.get("/", getMedia);

// Like
router.post(
  "/like/:id",
  auth,
  likeMedia
);

// Favorite
router.post(
  "/favorite/:id",
  auth,
  addFavorite
);

// Comment
router.post("/comment/:id", addComment);

// Delete Media
router.delete("/:id", deleteMedia);

// Test Route
router.get("/hello", (req, res) => {
  res.send("Media routes working");
});

module.exports = router;