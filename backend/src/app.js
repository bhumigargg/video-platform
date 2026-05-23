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
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  "https://video-platform-rosy-psi.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
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