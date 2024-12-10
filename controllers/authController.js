const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

exports.signup = async (req, res) => {
    console.log('Received signup request:', req.body);
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ status: 400, message: "Missing email or password.", data: null });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
        [email, hashedPassword, "admin"] // Default role as "viewer"
      );
      res.status(201).json({ status: 201, message: "User created successfully.", data: result.rows[0] });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({ status: 409, message: "Email already exists.", data: null });
      }
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  

  exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ status: 400, message: "Missing email or password.", data: null });
    }
  
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 404, message: "User not found.", data: null });
      }
  
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ status: 401, message: "Invalid credentials.", data: null });
      }
  
      const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      res.status(200).json({ status: 200, message: "Login successful.", data: { token } });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.logout = async (req, res) => {
    // Invalidate the token on the client side (server doesn't store JWTs)
    res.status(200).json({ status: 200, message: "User logged out successfully.", data: null });
  };
  
