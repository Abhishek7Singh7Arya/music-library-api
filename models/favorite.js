const pool = require("../db");

const createFavoritesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      favorite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      category VARCHAR(10) NOT NULL CHECK (category IN ('artist', 'album', 'track')),
      item_id UUID NOT NULL,
      UNIQUE (user_id, category, item_id)
    );
  `);
};

createFavoritesTable().catch((err) => console.error("Error creating favorites table:", err));

module.exports = pool;
