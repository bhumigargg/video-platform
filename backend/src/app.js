const express = require("express");

const cors = require("cors");

const app = express();


// ROUTES
const authRoutes = require(
  "./routes/auth.routes"
);

const videoRoutes = require(
  "./routes/video.routes"
);

const adminRoutes = require(
  "./routes/admin.routes"
);


// MIDDLEWARES
app.use(
  cors({
    origin:
      "http://localhost:5173",

    credentials: true,
  })
);

app.use(express.json());


// ROUTES
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