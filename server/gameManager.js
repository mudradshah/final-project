const { v4: uuidv4 } = require("uuid");

const games = {};

// helper: check winner
function checkWinner(board, size) {
  const lines = [];

  // rows
  for (let r = 0; r < size; r++) {
    lines.push([...Array(size)].map((_, c) => r * size + c));
  }

  // cols
  for (let c = 0; c < size; c++) {
    lines.push([...Array(size)].map((_, r) => r * size + c));
  }

  // diagonals
  lines.push([...Array(size)].map((_, i) => i * size + i));
  lines.push([...Array(size)].map((_, i) => i * size + (size - 1 - i)));

  for (const line of lines) {
    const first = board[line[0]];
    if (!first) continue;
    if (line.every((i) => board[i] === first)) {
      return { winner: first, line };
    }
  }

  if (board.every(Boolean)) return { winner: "draw", line: [] };

  return { winner: null, denote: [] };
}

function createGame(socketId, name, color) {
  const gameId = uuidv4().slice(0, 6).toUpperCase();

  const game = {
    gameId,
    boardSize: 3,
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    winningLine: [],
    players: {
      X: { socketId, name, color },
      O: null,
    },
  };

  games[gameId] = game;
  return game;
}

function joinGame(gameId, socketId, name, color) {
  const game = games[gameId];
  if (!game) return { error: "Game not found" };
  if (game.players.O) return { error: "Game full" };

  game.players.O = { socketId, name, color };
  return { game };
}

function makeMove(gameId, socketId, index) {
  const game = games[gameId];
  if (!game) return { error: "Game not found" };
  if (game.winner) return { error: "Game over" };

  const player =
    game.players.X.socketId === socketId
      ? "X"
      : game.players.O?.socketId === socketId
      ? "O"
      : null;

  if (!player) return { error: "Not your game" };
  if (player !== game.currentPlayer) return { error: "Not your turn" };
  if (game.board[index]) return { error: "Cell already filled" };

  game.board[index] = player;

  const result = checkWinner(game.board, game.boardSize);
  if (result.winner) {
    game.winner = result.winner;
    game.winningLine = result.line;
  } else {
    game.currentPlayer = player === "X" ? "O" : "X";
  }

  return { game };
}

module.exports = {
  createGame,
  joinGame,
  makeMove,
};
