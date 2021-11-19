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
      <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <DialogContentText sx={{ textAlign: "left" }}>
          Tham gia Paper Community ngay
        </DialogContentText>
        <Button
          sx={{ mt: 2, width: "80%" }}
          variant="contained"
          component={Link}
          to="/login"
          onClick={toggleDialog}
        >
          Đăng nhập
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleDialog}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
