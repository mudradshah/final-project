import { socket } from "../socket/socket";
import {
  board$,
  boardSize$,
  currentPlayer$,
  winner$,
  winningLine$,
  playerNames$,
  playerColors$,
  isGameStarted$,
} from "../gameService";

/* =====================
   SOCKET CONNECT
===================== */
export function connectSocket() {
  if (!socket.connected) {
    socket.connect();
  }
}

/* =====================
   CREATE GAME (Player X)
===================== */
export function createGame({ playerName, playerColor }) {
  connectSocket();
  socket.emit("create-game", { playerName, playerColor });
}

/* =====================
   JOIN GAME (Player O)
===================== */
export function joinGame({ gameId, playerName, playerColor }) {
  if (!gameId) return;
  connectSocket();
  socket.emit("join-game", { gameId, playerName, playerColor });
}

/* =====================
   SEND MOVE
===================== */
export function sendMove(gameId, index) {
  if (!gameId) return;
  socket.emit("make-move", { gameId, index });
}

/* =====================
   REGISTER SOCKET LISTENERS
   CALL ONLY ONCE
===================== */
export function registerRealtimeListeners() {
  socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
  });

  /* CREATE GAME */
  socket.on("game-created", (game) => {
    console.log("🎮 Game created:", game.gameId);
    syncGame(game);

    // creator enters game screen
    isGameStarted$.next(true);
  });

  /* JOIN / MOVE UPDATE */
  socket.on("game-updated", (game) => {
    console.log("🔄 Game updated:", game.gameId);
    syncGame(game);

    // JOIN GAME FIX: second player also enters game screen
    isGameStarted$.next(true);
  });

  socket.on("error-message", (msg) => {
    alert(msg);
  });
}

/* =====================
   SERVER → RXJS SYNC
===================== */
function syncGame(game) {
  board$.next(game.board);
  boardSize$.next(game.boardSize);
  currentPlayer$.next(game.currentPlayer);
  winner$.next(game.winner);
  winningLine$.next(game.winningLine || []);

  playerNames$.next({
    X: game.players.X?.name || "Player X",
    O: game.players.O?.name || "Player O",
  });

  playerColors$.next({
    X: game.players.X?.color || "#1976d2",
    O: game.players.O?.color || "#d32f2f",
  });

  // store gameId globally for moves
  window.__GAME_ID__ = game.gameId;
}
