const express = require("express");

const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const videoRoutes = require("./routes/video.routes");

const adminRoutes = require("./routes/admin.routes");


const app = express();


// IMPORTANT
app.use(express.json());


// CORS
app.use(
  cors({

    origin: [
      "http://localhost:5173",

      "https://video-platform-rosy-psi.vercel.app/",
    ],

    credentials: true,
  })
);


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