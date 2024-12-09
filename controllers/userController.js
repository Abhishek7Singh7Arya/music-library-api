const pool = require("../db");

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT user_id, email, role FROM users");
    res.status(200).json({ message: "Users fetched successfully.", data: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addUser = async (req, res) => {
  const { email, password, role } = req.body;
  if (role === "admin") {
    return res.status(403).json({ message: "Cannot create an admin user." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
      [email, hashedPassword, role]
    );
    res.status(201).json({ message: "User created successfully.", data: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      res.status(409).json({ message: "Email already exists." });
    } else {
      res.status(400).json({ message: "Bad Request" });
    }
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully.", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.updatePassword = async (req, res) => {
    const { old_password, new_password } = req.body;
    const userId = req.user.userId;
  
    try {
      const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 404, message: "User not found.", data: null });
      }
  
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(old_password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ status: 400, message: "Old password is incorrect.", data: null });
      }
  
      const hashedPassword = await bcrypt.hash(new_password, 10);
      await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [hashedPassword, userId]);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  