const express = require("express");
const { signup, login,logout } = require("../controllers/authController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", verifyToken, logout);

module.exports = router;
