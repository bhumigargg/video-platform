const express = require("express");

const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const videoRoutes = require("./routes/video.routes");

const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(express.json());


// FIXED CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/videos",
  videoRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

module.exports = app;