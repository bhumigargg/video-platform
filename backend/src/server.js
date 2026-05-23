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
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
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