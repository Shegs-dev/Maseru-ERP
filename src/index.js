const express = require("express");
const serverless = require("serverless-http");

const app = express();
const http = require("http");

const cors = require("cors");

const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hosting Maseru backend successful!!",
  });
});

app.use(`/.netlify/functions/index`, router);

const io = new Server(server, {
  cors: {
    origin: "https://erp-plutospace.netlify.app",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

const TOKEN = process.env.TWITTER_BEARER_TOKEN;

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("SERVER RUNNING");
  // console.log("something");
});

module.exports = app;
module.exports.handler = serverless(app);
