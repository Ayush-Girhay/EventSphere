const express = require("express");

const auth = require("../middleware/auth");
const checkRole = require(
  "../middleware/checkRole"
);

const {
  getUsers,
  changeRole,
  deleteUser,
} = require(
  "../controllers/adminController"
);

const router = express.Router();

router.get(
  "/users",
  auth,
  checkRole(["Admin"]),
  getUsers
);

router.put(
  "/users/:id",
  auth,
  checkRole(["Admin"]),
  changeRole
);

router.delete(
  "/users/:id",
  auth,
  checkRole(["Admin"]),
  deleteUser
);

module.exports = router;