const express = require("express");
const { getAllUsers, addUser, deleteUser,updatePassword } = require("../controllers/userController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, requireRole(["admin"]), getAllUsers);
router.post("/add-user", verifyToken, requireRole(["admin"]), addUser);
router.delete("/:id", verifyToken, requireRole(["admin"]), deleteUser);
router.put("/update-password", verifyToken, updatePassword);

module.exports = router;
