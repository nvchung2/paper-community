import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import useLoginRequiredDialog from "hooks/useLoginRequiredDialog";
import React from "react";
import { Link } from "react-router-dom";

export default function LoginRequiredDialog() {
  const { show, toggleDialog } = useLoginRequiredDialog();
  return (
    <Dialog open={show} onClose={toggleDialog} maxWidth="xs">
      <DialogTitle>Login to continue</DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <DialogContentText sx={{ textAlign: "left" }}>
          Join our community where coders share and and stay up-to-date
        </DialogContentText>
        <Button
          sx={{ mt: 2, width: "80%" }}
          variant="contained"
          component={Link}
          to="/login"
          onClick={toggleDialog}
        >
          Login
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
