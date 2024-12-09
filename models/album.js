const pool = require("../db");

const createAlbumTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS albums (
      album_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      year INTEGER CHECK (year > 0),
      hidden BOOLEAN DEFAULT false,
      artist_id UUID NOT NULL REFERENCES artists(artist_id) ON DELETE CASCADE
    );
  `);
};

createAlbumTable().catch((err) => console.error("Error creating albums table:", err));

module.exports = pool;
