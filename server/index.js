const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./db");
const {
  createGame,
  joinGame,
  makeMove,
} = require("./services/gameService");

// =======================
// CONNECT DATABASE
// =======================
connectDB();

// =======================
// APP & SERVER
// =======================
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

// =======================
// SOCKET.IO
// =======================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // -----------------------
  // CREATE GAME
  // -----------------------
  socket.on("create-game", async ({ playerName, playerColor }) => {
    try {
      const game = await createGame(
        socket.id,
        playerName,
        playerColor
      );

      socket.join(game.gameId);
      socket.emit("game-created", game);
    } catch (err) {
      socket.emit("error-message", err.message);
    }
  });

  // -----------------------
  // JOIN GAME
  // -----------------------
  socket.on("join-game", async ({ gameId, playerName, playerColor }) => {
    try {
      const result = await joinGame(
        gameId,
        socket.id,
        playerName,
        playerColor
      );

      if (result.error) {
        socket.emit("error-message", result.error);
        return;
      }

      socket.join(gameId);
      io.to(gameId).emit("game-updated", result.game);
    } catch (err) {
      socket.emit("error-message", err.message);
    }
  });

  // -----------------------
  // MAKE MOVE
  // -----------------------
  socket.on("make-move", async ({ gameId, index }) => {
    try {
      const result = await makeMove(gameId, socket.id, index);

      if (result.error) {
        socket.emit("error-message", result.error);
        return;
      }

      io.to(gameId).emit("game-updated", result.game);
    } catch (err) {
      socket.emit("error-message", err.message);
    }
  });

  // -----------------------
  // DISCONNECT
  // -----------------------
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// =======================
// START SERVER
// =======================
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
