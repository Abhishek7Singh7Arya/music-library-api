exports.getAllArtists = async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM artists");
      res.status(200).json({ message: "Artists fetched successfully.", data: result.rows });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  exports.addArtist = async (req, res) => {
    const { name, grammy, hidden } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO artists (name, grammy, hidden) VALUES ($1, $2, $3) RETURNING *",
        [name, grammy, hidden]
      );
      res.status(201).json({ message: "Artist added successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(400).json({ message: "Bad Request" });
    }
  };
  
  exports.updateArtist = async (req, res) => {
    const { id } = req.params;
    const { name, grammy, hidden } = req.body;
    try {
      const result = await pool.query(
        "UPDATE artists SET name = $1, grammy = $2, hidden = $3 WHERE artist_id = $4 RETURNING *",
        [name, grammy, hidden, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Artist not found." });
      }
      res.status(200).json({ message: "Artist updated successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(400).json({ message: "Bad Request" });
    }
  };
  
  exports.deleteArtist = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query("DELETE FROM artists WHERE artist_id = $1 RETURNING *", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Artist not found." });
      }
      res.status(200).json({ message: "Artist deleted successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  exports.getArtistById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query("SELECT * FROM artists WHERE artist_id = $1", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 404, message: "Artist not found.", data: null });
      }
      res.status(200).json({ status: 200, message: "Artist retrieved successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.getAlbumById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query("SELECT * FROM albums WHERE album_id = $1", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 404, message: "Album not found.", data: null });
      }
      res.status(200).json({ status: 200, message: "Album retrieved successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.getTrackById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query("SELECT * FROM tracks WHERE track_id = $1", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 404, message: "Track not found.", data: null });
      }
      res.status(200).json({ status: 200, message: "Track retrieved successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.getAllAlbums = async (req, res) => {
    const { artist_id, hidden, limit = 5, offset = 0 } = req.query;
  
    try {
      const query = `
        SELECT * FROM albums
        WHERE ($1::UUID IS NULL OR artist_id = $1)
        AND ($2::BOOLEAN IS NULL OR hidden = $2)
        LIMIT $3 OFFSET $4;
      `;
      const result = await pool.query(query, [artist_id, hidden, limit, offset]);
      res.status(200).json({ status: 200, message: "Albums retrieved successfully.", data: result.rows });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.getAllTracks = async (req, res) => {
    const { album_id, hidden, limit = 5, offset = 0 } = req.query;
  
    try {
      const query = `
        SELECT * FROM tracks
        WHERE ($1::UUID IS NULL OR album_id = $1)
        AND ($2::BOOLEAN IS NULL OR hidden = $2)
        LIMIT $3 OFFSET $4;
      `;
      const result = await pool.query(query, [album_id, hidden, limit, offset]);
      res.status(200).json({ status: 200, message: "Tracks retrieved successfully.", data: result.rows });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.getFavoritesByCategory = async (req, res) => {
    const { category } = req.params;
    const userId = req.user.userId;
  
    try {
      const result = await pool.query(
        "SELECT * FROM favorites WHERE user_id = $1 AND category = $2",
        [userId, category]
      );
      res.status(200).json({ status: 200, message: "Favorites retrieved successfully.", data: result.rows });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.removeFavorite = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query("DELETE FROM favorites WHERE favorite_id = $1 RETURNING *", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 404, message: "Favorite not found.", data: null });
      }
      res.status(200).json({ status: 200, message: "Favorite removed successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.addAlbum = async (req, res) => {
    const { name, year, artist_id, hidden } = req.body;
  
    if (!name || !year || !artist_id) {
      return res.status(400).json({ status: 400, message: "Missing required fields.", data: null });
    }
  
    try {
      const result = await pool.query(
        "INSERT INTO albums (name, year, artist_id, hidden) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, year, artist_id, hidden || false]
      );
      res.status(201).json({ status: 201, message: "Album created successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.updateAlbum = async (req, res) => {
    const { id } = req.params;
    const { name, year, hidden } = req.body;
  
    try {
      const result = await pool.query(
        "UPDATE albums SET name = $1, year = $2, hidden = $3 WHERE album_id = $4 RETURNING *",
        [name, year, hidden, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 404, message: "Album not found.", data: null });
      }
  
      res.status(200).json({ status: 200, message: "Album updated successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.deleteAlbum = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query("DELETE FROM albums WHERE album_id = $1 RETURNING *", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 404, message: "Album not found.", data: null });
      }
      res.status(200).json({ status: 200, message: "Album deleted successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.addTrack = async (req, res) => {
    const { name, duration, album_id, hidden } = req.body;
  
    if (!name || !duration || !album_id) {
      return res.status(400).json({ status: 400, message: "Missing required fields.", data: null });
    }
  
    try {
      const result = await pool.query(
        "INSERT INTO tracks (name, duration, album_id, hidden) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, duration, album_id, hidden || false]
      );
      res.status(201).json({ status: 201, message: "Track created successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.updateTrack = async (req, res) => {
    const { id } = req.params;
    const { name, duration, hidden } = req.body;
  
    try {
      const result = await pool.query(
        "UPDATE tracks SET name = $1, duration = $2, hidden = $3 WHERE track_id = $4 RETURNING *",
        [name, duration, hidden, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 404, message: "Track not found.", data: null });
      }
  
      res.status(200).json({ status: 200, message: "Track updated successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.deleteTrack = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query("DELETE FROM tracks WHERE track_id = $1 RETURNING *", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 404, message: "Track not found.", data: null });
      }
      res.status(200).json({ status: 200, message: "Track deleted successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  exports.addFavorite = async (req, res) => {
    const { category, item_id } = req.body;
    const userId = req.user.userId;
  
    if (!category || !item_id) {
      return res.status(400).json({ status: 400, message: "Missing required fields.", data: null });
    }
  
    try {
      const result = await pool.query(
        "INSERT INTO favorites (user_id, category, item_id) VALUES ($1, $2, $3) RETURNING *",
        [userId, category, item_id]
      );
      res.status(201).json({ status: 201, message: "Favorite added successfully.", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal Server Error.", error: error.message });
    }
  };
  