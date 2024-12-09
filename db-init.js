const pool = require("./db");

// Function to initialize all tables
const initDb = async () => {
  try {
    console.log("Initializing database...");

    // Create Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'editor', 'viewer'))
      );
    `);
    console.log("Users table created.");

    // Create Artists Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS artists (
        artist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        grammy BOOLEAN DEFAULT false,
        hidden BOOLEAN DEFAULT false
      );
    `);
    console.log("Artists table created.");

    // Create Albums Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS albums (
        album_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        year INTEGER CHECK (year > 0),
        hidden BOOLEAN DEFAULT false,
        artist_id UUID NOT NULL REFERENCES artists(artist_id) ON DELETE CASCADE
      );
    `);
    console.log("Albums table created.");

    // Create Tracks Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tracks (
        track_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        duration INTEGER CHECK (duration > 0),
        hidden BOOLEAN DEFAULT false,
        album_id UUID NOT NULL REFERENCES albums(album_id) ON DELETE CASCADE
      );
    `);
    console.log("Tracks table created.");

    // Create Favorites Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        favorite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        category VARCHAR(10) NOT NULL CHECK (category IN ('artist', 'album', 'track')),
        item_id UUID NOT NULL,
        UNIQUE (user_id, category, item_id)
      );
    `);
    console.log("Favorites table created.");

    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing database:", err.message);
  } finally {
    pool.end(); // Close the database connection
  }
};

// Run the initialization
initDb();
