const Game = require("../models/Game");
const { v4: uuidv4 } = require("uuid");

/* ======================
   CREATE GAME
====================== */
async function createGame(socketId, playerName, playerColor) {
  const gameId = uuidv4().slice(0, 6).toUpperCase();

  const game = await Game.create({
    gameId,
    players: {
      X: {
        name: playerName,
        color: playerColor,
        socketId,
      },
    },
    board: Array(9).fill(null),
  });

  return game;
}

/* ======================
   JOIN GAME
====================== */
async function joinGame(gameId, socketId, playerName, playerColor) {
  const game = await Game.findOne({ gameId });
  if (!game) return { error: "Game not found" };

  if (game.players.O) {
    return { error: "Game full" };
  }

  game.players.O = {
    name: playerName,
    color: playerColor,
    socketId,
  };

  await game.save();
  return { game };
}

/* ======================
   MAKE MOVE
====================== */
async function makeMove(gameId, socketId, index) {
  const game = await Game.findOne({ gameId });
  if (!game) return { error: "Game not found" };
  if (game.status === "FINISHED") return { error: "Game over" };
  if (game.board[index]) return { error: "Cell already filled" };

  // Decide player by socketId
  const player =
    game.players.X?.socketId === socketId
      ? "X"
      : game.players.O?.socketId === socketId
      ? "O"
      : null;

  if (!player) return { error: "Not your game" };
  if (player !== game.currentPlayer) return { error: "Not your turn" };

  game.board[index] = player;
  game.moves.push({ player, index });

  const result = checkWinner(game.board);
  if (result.winner) {
    game.winner = result.winner;
    game.winningLine = result.line;
    game.status = "FINISHED";

    if (result.winner === "draw") {
      game.score.draw += 1;
    } else {
      game.score[result.winner] += 1;
    }
  } else {
    game.currentPlayer = player === "X" ? "O" : "X";
  }

  await game.save();
  return { game };
}

/* ======================
   WINNER CHECK
====================== */
function checkWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }

  if (board.every(Boolean)) {
    return { winner: "draw", line: [] };
  }

  return { winner: null, line: [] };
}

module.exports = {
  createGame,
  joinGame,
  makeMove,
};
