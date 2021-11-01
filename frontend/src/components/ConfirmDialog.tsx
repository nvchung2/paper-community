import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
interface Props {
  actionButton: React.ReactElement;
  message: string;
  onAccept: () => any;
}
export default function ConfirmDialog({
  actionButton,
  message,
  onAccept,
}: Props) {
  const [open, setOpen] = useState(false);
  const btn = React.cloneElement(actionButton, {
    onClick: () => setOpen(true),
  });
  return (
    <>
      {btn}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm your action</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              onAccept();
            }}
          >
            YES
          </Button>
          <Button onClick={() => setOpen(false)}>NO</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
