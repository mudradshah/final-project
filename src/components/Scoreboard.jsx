import React from "react";
import { Box, Typography, Stack } from "@mui/material";

export default function Scoreboard({ scores, playerNames, playerColors }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "action.hover",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Scoreboard
      </Typography>

      <Stack spacing={1}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: 1,
              backgroundColor: playerColors?.X || "#1976d2",
              border: "1px solid rgba(0,0,0,0.12)",
            }}
          />
          <Typography variant="body1" sx={{ flex: 1 }}>
            {playerNames.X} (X):
          </Typography>
          <Typography variant="body1">
            <strong>{scores.X}</strong>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: 1,
              backgroundColor: playerColors?.O || "#d32f2f",
              border: "1px solid rgba(0,0,0,0.12)",
            }}
          />
          <Typography variant="body1" sx={{ flex: 1 }}>
            {playerNames.O} (O):
          </Typography>
          <Typography variant="body1">
            <strong>{scores.O}</strong>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: 1,
              backgroundColor: "transparent",
              border: "1px solid rgba(0,0,0,0.12)",
            }}
          />
          <Typography variant="body1" sx={{ flex: 1 }}>
            Draws:
          </Typography>
          <Typography variant="body1">
            <strong>{scores.draw}</strong>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
