import React from "react";
import { Button } from "@mui/material";

/** Return 'white' or 'black' depending on contrast for given hex color */
function getContrastText(hex) {
  if (!hex) return "white";
  // normalize
  const c = hex.replace("#", "");
  const r = parseInt(c.substr(0, 2), 16) / 255;
  const g = parseInt(c.substr(2, 2), 16) / 255;
  const b = parseInt(c.substr(4, 2), 16) / 255;

  // relative luminance
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.55 ? "black" : "white";
}

export default function Square({ value, onClick, isWinning, playerColors }) {
  const bg = value ? (playerColors?.[value] || (value === "X" ? "#1976d2" : "#d32f2f")) : null;
  const color = value ? getContrastText(bg) : undefined;

  return (
    <Button
      onClick={onClick}
      variant={value ? "contained" : "outlined"}
      sx={{
        aspectRatio: "1 / 1",
        minWidth: 0,
        fontSize: 34,
        fontWeight: 900,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: isWinning ? "success.main" : "divider",
        bgcolor: value ? bg : "background.paper",
        color: value ? color : "text.primary",
        boxShadow: isWinning ? 4 : 0,
        zIndex: 1,
        transition: "box-shadow 0.15s ease",
      }}
    >
      {value}
    </Button>
  );
}
