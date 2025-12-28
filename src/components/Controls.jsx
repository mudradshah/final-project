import React, { useState } from "react";
import {
  Stack,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export default function Controls({
  onNewGame,
  onResetAll,
  onUndo,
  canUndo,
}) {
  const [undoOpen, setUndoOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const handleUndoClick = () => {
    if (!canUndo) return;
    setUndoOpen(true);
  };

  const handleResetClick = () => {
    setResetOpen(true);
  };

  const confirmUndo = () => {
    setUndoOpen(false);
    if (onUndo) onUndo();
  };

  const confirmReset = () => {
    setResetOpen(false);
    if (onResetAll) onResetAll();
  };

  return (
    <>
      <Stack
        spacing={2}
        sx={{
          p: 2,
          bgcolor: "action.hover",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Controls</Typography>

        {/* 3 BUTTONS IN ONE ROW */}
        <Stack
          direction="row"
          spacing={1.2}
        >
          <Button
            variant="contained"
            onClick={onNewGame}
            fullWidth
          >
            NEW ROUND
          </Button>

          <Button
            variant="outlined"
            color="warning"
            onClick={handleUndoClick}
            disabled={!canUndo}
            fullWidth
          >
            UNDO
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleResetClick}
            fullWidth
          >
            RESET ALL
          </Button>
        </Stack>
      </Stack>

      {/* UNDO CONFIRM DIALOG */}
      <Dialog open={undoOpen} onClose={() => setUndoOpen(false)}>
        <DialogTitle>Undo last move?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to undo the last move?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUndoOpen(false)}>Cancel</Button>
          <Button onClick={confirmUndo} autoFocus>
            Undo
          </Button>
        </DialogActions>
      </Dialog>

      {/* RESET CONFIRM DIALOG */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>Reset entire game?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will clear the board, scores and go back to the setup screen.
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button onClick={confirmReset} color="error" autoFocus>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
