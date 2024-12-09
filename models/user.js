const pool = require("../db");

const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'editor', 'viewer'))
    );
  `);
};

createUserTable().catch((err) => console.error("Error creating users table:", err));

module.exports = pool;
