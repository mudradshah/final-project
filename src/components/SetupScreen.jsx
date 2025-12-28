import React, { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";

import {
  playerNames$,
  playerColors$,
} from "../gameService";
import { useObservable } from "../hooks/useObservable";
import {
  createGame,
  joinGame,
} from "../services/realtimeService";

export default function SetupScreen() {
  const playerNames = useObservable(playerNames$, playerNames$.value);
  const playerColors = useObservable(playerColors$, playerColors$.value);

  const [gameId, setGameId] = useState("");

  return (
    <Box sx={{ maxWidth: 420, mx: "auto" }}>
      <Stack spacing={3}>
        <Typography variant="h5" textAlign="center">
          Multiplayer Tic Tac Toe
        </Typography>

        <TextField
          label="Your name"
          value={playerNames.X}
          onChange={(e) =>
            playerNames$.next({ ...playerNames, X: e.target.value })
          }
        />

        {/* CREATE */}
        <Button
          variant="contained"
          onClick={() =>
            createGame({
              playerName: playerNames.X,
              playerColor: playerColors.X,
            })
          }
        >
          CREATE GAME
        </Button>

        <Typography textAlign="center">OR</Typography>

        {/* JOIN */}
        <TextField
          label="Enter Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value.toUpperCase())}
        />

        <Button
          variant="outlined"
          onClick={() =>
            joinGame({
              gameId,
              playerName: playerNames.X,
              playerColor: playerColors.O,
            })
          }
        >
          JOIN GAME
        </Button>
      </Stack>
    </Box>
  );
}
