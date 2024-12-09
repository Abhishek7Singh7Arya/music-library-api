const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const musicRoutes = require("./routes/musicRoutes");

// Import models to trigger table creation
require("./models/user");
require("./models/artist");
require("./models/album");
require("./models/track");
require("./models/favorite");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/music", musicRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
