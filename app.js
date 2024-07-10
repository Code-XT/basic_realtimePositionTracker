const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
    io.emit("user-disconnected", socket.id);
  });

  socket.on("sendLocation", (data) => {
    console.log(data);
    io.emit("receiveLocation", { id: socket.id, ...data });
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
