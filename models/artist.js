const pool = require("../db");

const createArtistTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS artists (
      artist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      grammy BOOLEAN DEFAULT false,
      hidden BOOLEAN DEFAULT false
    );
  `);
};

createArtistTable().catch((err) => console.error("Error creating artists table:", err));

module.exports = pool;
