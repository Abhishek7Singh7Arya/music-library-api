const pool = require("../db");

const createTrackTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tracks (
      track_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      duration INTEGER CHECK (duration > 0),
      hidden BOOLEAN DEFAULT false,
      album_id UUID NOT NULL REFERENCES albums(album_id) ON DELETE CASCADE
    );
  `);
};

createTrackTable().catch((err) => console.error("Error creating tracks table:", err));

module.exports = pool;
