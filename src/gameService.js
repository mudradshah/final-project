import { BehaviorSubject } from "rxjs";

// helpers
const makeEmptyBoard = (size) => Array(size * size).fill(null);

const generateWinningLines = (size) => {
  const lines = [];

  // rows
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push(r * size + c);
    }
    lines.push(row);
  }

  // cols
  for (let c = 0; c < size; c++) {
    const col = [];
    for (let r = 0; r < size; r++) {
      col.push(r * size + c);
    }
    lines.push(col);
  }

  // main diag
  const mainDiag = [];
  for (let i = 0; i < size; i++) {
    mainDiag.push(i * size + i);
  }
  lines.push(mainDiag);

  // anti diag
  const antiDiag = [];
  for (let i = 0; i < size; i++) {
    antiDiag.push(i * size + (size - 1 - i));
  }
  lines.push(antiDiag);

  return lines;
};

const computeWinner = (board, size) => {
  const lines = generateWinningLines(size);

  for (const line of lines) {
    const [firstIndex] = line;
    const firstVal = board[firstIndex];
    if (!firstVal) continue;

    const allSame = line.every((idx) => board[idx] === firstVal);
    if (allSame) {
      return { winner: firstVal, line };
    }
  }

  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return { winner: "draw", line: [] };
  }

  return { winner: null, line: [] };
};

const getStartingPlayer = (startMode) => {
  if (startMode === "X" || startMode === "O") return startMode;
  // RANDOM
  return Math.random() < 0.5 ? "X" : "O";
};

// === BehaviorSubjects ===
export const boardSize$ = new BehaviorSubject(3);
export const board$ = new BehaviorSubject(makeEmptyBoard(3));
export const currentPlayer$ = new BehaviorSubject("X");
export const winner$ = new BehaviorSubject(null); // "X" | "O" | "draw" | null
export const winningLine$ = new BehaviorSubject([]);
export const moveCount$ = new BehaviorSubject(0);
export const scores$ = new BehaviorSubject({ X: 0, O: 0, draw: 0 });
export const playerNames$ = new BehaviorSubject({
  X: "Player X",
  O: "Player O",
});
export const playerColors$ = new BehaviorSubject({
  X: "#1976d2", // default blue
  O: "#d32f2f", // default red
});
export const startMode$ = new BehaviorSubject("X"); // "X" | "O" | "RANDOM"
export const history$ = new BehaviorSubject([]); // undo history
export const timerRemaining$ = new BehaviorSubject(10);
export const isGameStarted$ = new BehaviorSubject(false);

// ⏳ timer: 10 second per move
let timerId = null;

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startTimer() {
  stopTimer();
  timerRemaining$.next(10);

  timerId = setInterval(() => {
    // game finished?
    if (winner$.value !== null || !isGameStarted$.value) {
      stopTimer();
      return;
    }

    const current = timerRemaining$.value;

    if (current > 1) {
      timerRemaining$.next(current - 1);
    } else {
      // time over: auto switch player
      const currentPlayer = currentPlayer$.value;
      const next = currentPlayer === "X" ? "O" : "X";
      currentPlayer$.next(next);
      timerRemaining$.next(10);
    }
  }, 1000);
}

// === Actions ===
export function startNewRound() {
  const size = boardSize$.value;
  const start = getStartingPlayer(startMode$.value);

  board$.next(makeEmptyBoard(size));
  currentPlayer$.next(start);
  winner$.next(null);
  winningLine$.next([]);
  moveCount$.next(0);
  history$.next([]);
  timerRemaining$.next(10);

  if (isGameStarted$.value) {
    startTimer();
  }
}

// first page par "Start Game" par call
export function startGame() {
  isGameStarted$.next(true);
  startNewRound();
}

export function resetAll() {
  boardSize$.next(3);
  scores$.next({ X: 0, O: 0, draw: 0 });
  playerNames$.next({ X: "Player X", O: "Player O" });
  playerColors$.next({ X: "#1976d2", O: "#d32f2f" });
  startMode$.next("X");

  board$.next(makeEmptyBoard(3));
  currentPlayer$.next("X");
  winner$.next(null);
  winningLine$.next([]);
  moveCount$.next(0);
  history$.next([]);
  stopTimer();
  timerRemaining$.next(10);
  isGameStarted$.next(false); // back to setup screen
}

export function changeBoardSize(size) {
  boardSize$.next(size);
  board$.next(makeEmptyBoard(size));
}

export function changeStartMode(mode) {
  startMode$.next(mode);
}

export function changePlayerName(symbol, name) {
  const current = playerNames$.value;
  playerNames$.next({ ...current, [symbol]: name || `Player ${symbol}` });
}

export function changePlayerColor(symbol, color) {
  const current = playerColors$.value;
  playerColors$.next({ ...current, [symbol]: color });
}

export function handleCellClick(index) {
  if (!isGameStarted$.value) return;

  const winner = winner$.value;
  const board = board$.value;
  const current = currentPlayer$.value;
  const size = boardSize$.value;

  if (winner !== null) return; // game over
  if (board[index] !== null) return; // cell already filled

  // store snapshot for undo
  const history = history$.value;
  history$.next([...history, { board: [...board], currentPlayer: current }]);

  const newBoard = [...board];
  newBoard[index] = current;
  board$.next(newBoard);

  const result = computeWinner(newBoard, size);
  const newMoveCount = moveCount$.value + 1;
  moveCount$.next(newMoveCount);

  if (result.winner) {
    winner$.next(result.winner);
    winningLine$.next(result.line);

    if (result.winner === "X" || result.winner === "O") {
      const scores = scores$.value;
      scores$.next({ ...scores, [result.winner]: scores[result.winner] + 1 });
    } else if (result.winner === "draw") {
      const scores = scores$.value;
      scores$.next({ ...scores, draw: scores.draw + 1 });
    }

    stopTimer();
    return;
  }

  // switch player
  const nextPlayer = current === "X" ? "O" : "X";
  currentPlayer$.next(nextPlayer);
  startTimer(); // new player's 10 sec
}

export function undoLastMove() {
  if (!isGameStarted$.value) return;
  if (winner$.value !== null) return;

  const history = history$.value;
  if (history.length === 0) return;

  const last = history[history.length - 1];
  history$.next(history.slice(0, -1));

  board$.next(last.board);
  currentPlayer$.next(last.currentPlayer);
  moveCount$.next(Math.max(0, moveCount$.value - 1));
  winningLine$.next([]);
  winner$.next(null);

  startTimer();
}
