import React from "react";
import { Box } from "@mui/material";
import Square from "./Square";

export default function Board({
  board,
  boardSize,
  onCellClick,
  winningLine,
  winner,
  playerColors,
}) {
  const cell = 90;
  const gap = 8;
  const thick = 8;
  const size = cell * boardSize + gap * (boardSize - 1);

  const lineColor =
    winner === "X"
      ? playerColors.X
      : winner === "O"
      ? playerColors.O
      : "transparent";

  const getLine = () => {
    if (!winningLine.length) return null;

    const a = winningLine[0];
    const c = winningLine[winningLine.length - 1];
    const r1 = Math.floor(a / boardSize);
    const r2 = Math.floor(c / boardSize);
    const col1 = a % boardSize;
    const col2 = c % boardSize;

    if (r1 === r2) {
      return {
        top: r1 * (cell + gap) + cell / 2 - thick / 2,
        left: 0,
        width: size,
        height: thick,
      };
    }

    if (col1 === col2) {
      return {
        left: col1 * (cell + gap) + cell / 2 - thick / 2,
        top: 0,
        width: thick,
        height: size,
      };
    }

    const len = Math.sqrt(2) * size;
    return {
      width: len,
      height: thick,
      top: size / 2 - thick / 2,
      left: size / 2 - len / 2,
      transform: a === 0 ? "rotate(45deg)" : "rotate(-45deg)",
    };
  };

  const line = getLine();

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns: `repeat(${boardSize}, ${cell}px)`,
        gap,
      }}
    >
      {line && (
        <Box
          sx={{
            position: "absolute",
            backgroundColor: lineColor,
            borderRadius: 3,
            zIndex: 10,
            ...line,
          }}
        />
      )}

      {board.map((v, i) => (
        <Square
          key={i}
          value={v}
          onClick={() => onCellClick(i)}
          playerColors={playerColors}
        />
      ))}
    </Box>
  );
}
