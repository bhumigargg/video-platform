require("dotenv").config();

const http = require("http");

const { Server } = require("socket.io");

const app = require("./app");

const connectDB = require("./config/db");

const { setIO } = require("./socket");


// Connect DB
connectDB();


// Create Server
const server = http.createServer(app);


// Socket.io
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "https://video-platform-rosy-psi.vercel.app",
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST"],
  },
});


// Save io globally
setIO(io);


// Socket Connection
io.on("connection", (socket) => {

  console.log("User Connected");

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });

});


// Start Server
server.listen(process.env.PORT, () => {

  console.log(
    `Server running on port ${process.env.PORT}`
  );

});