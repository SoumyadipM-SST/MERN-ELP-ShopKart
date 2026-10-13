const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  getUser,
  logOut
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/logout', logOut)
router.get("/me", authenticate, getUser);

module.exports = router;
