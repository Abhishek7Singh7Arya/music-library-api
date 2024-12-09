const express = require("express");
const { getAllArtists, addArtist, updateArtist, deleteArtist,getAlbumById, getAllAlbums, getTrackById, getAllTracks
    ,getFavoritesByCategory,updateAlbum,removeFavorite,addAlbum,deleteAlbum,addTrack,updateTrack,deleteTrack,addFavorite,getArtistById
 } = require("../controllers/musicController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/artists", verifyToken, requireRole(["viewer", "editor", "admin"]), getAllArtists);
router.post("/artists/add-artist", verifyToken, requireRole(["editor", "admin"]), addArtist);
router.put("/artists/:id", verifyToken, requireRole(["editor", "admin"]), updateArtist);
router.delete("/artists/:id", verifyToken, requireRole(["editor", "admin"]), deleteArtist);
router.get("/artists/:id", verifyToken, requireRole(["viewer", "editor", "admin"]), getArtistById);
router.get("/albums/:id", verifyToken, requireRole(["viewer", "editor", "admin"]), getAlbumById);
router.get("/albums", verifyToken, requireRole(["viewer", "editor", "admin"]), getAllAlbums);
router.get("/tracks/:id", verifyToken, requireRole(["viewer", "editor", "admin"]), getTrackById);
router.get("/tracks", verifyToken, requireRole(["viewer", "editor", "admin"]), getAllTracks);
router.get("/favorites/:category", verifyToken, getFavoritesByCategory);
router.delete("/favorites/remove-favorite/:id", verifyToken, removeFavorite);

router.put("/albums/:id", verifyToken, requireRole(["editor", "admin"]), updateAlbum);
router.post("/albums/add-album", verifyToken, requireRole(["editor", "admin"]), addAlbum);
router.delete("/albums/:id", verifyToken, requireRole(["editor", "admin"]), deleteAlbum);
router.post("/tracks/add-track", verifyToken, requireRole(["editor", "admin"]), addTrack);
router.put("/tracks/:id", verifyToken, requireRole(["editor", "admin"]), updateTrack);
router.delete("/tracks/:id", verifyToken, requireRole(["editor", "admin"]), deleteTrack);
router.post("/favorites/add-favorite", verifyToken, addFavorite);

module.exports = router;
