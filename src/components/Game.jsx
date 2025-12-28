import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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

import { useObservable } from "../hooks/useObservable";
import Board from "./Board";
import SetupScreen from "./SetupScreen";
import { sendMove } from "../services/realtimeService";

export default function Game() {
  const board = useObservable(board$, board$.value);
  const boardSize = useObservable(boardSize$, boardSize$.value);
  const currentPlayer = useObservable(currentPlayer$, currentPlayer$.value);
  const winner = useObservable(winner$, winner$.value);
  const winningLine = useObservable(winningLine$, winningLine$.value);
  const playerNames = useObservable(playerNames$, playerNames$.value);
  const playerColors = useObservable(playerColors$, playerColors$.value);
  const isGameStarted = useObservable(isGameStarted$, false);

  const gameId = window.__GAME_ID__;

  const handleCellClick = (index) => {
    if (!gameId) return;
    sendMove(gameId, index);
  };

  const copyGameId = () => {
    navigator.clipboard.writeText(gameId);
    alert("Game ID copied!");
  };

  const statusText = (() => {
    if (winner === "X" || winner === "O") {
      return `${playerNames[winner]} (${winner}) wins 🎉`;
    }
    if (winner === "draw") return "Draw 😅";
    return `${playerNames[currentPlayer]}'s turn (${currentPlayer})`;
  })();

  if (!isGameStarted) {
    return (
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <SetupScreen />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, borderRadius: 4 }}>
      <Stack spacing={2}>
        {/* GAME ID DISPLAY */}
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          <Chip
            label={`Game ID: ${gameId}`}
            color="primary"
            variant="outlined"
          />
          <Tooltip title="Copy Game ID">
            <IconButton size="small" onClick={copyGameId}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="h6" textAlign="center">
          {statusText}
        </Typography>

        <Divider />

        <Box display="flex" justifyContent="center">
          <Board
            board={board}
            boardSize={boardSize}
            onCellClick={handleCellClick}
            winningLine={winningLine}
            winner={winner}
            playerColors={playerColors}
          />
        </Box>
      </Stack>
    </Paper>
  );
}
