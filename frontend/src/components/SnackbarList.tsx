import { Alert, Snackbar, SnackbarCloseReason, Stack } from "@mui/material";
import useSnackbar from "hooks/useSnackbar";
import React from "react";

export default function SnackbarList() {
  const { snackbars, remove } = useSnackbar();
  const handleClose = (id: string, reason?: SnackbarCloseReason) => {
    if (reason == "clickaway") return;
    remove(id);
  };
  return (
    <Stack
      gap={2}
      position="fixed"
      left={10}
      bottom={10}
      zIndex={(theme) => theme.zIndex.snackbar}
    >
      {snackbars.map((toast) => (
        <Snackbar
          sx={{ position: "relative" }}
          open
          autoHideDuration={5000}
          key={toast.id}
          onClose={(e, r) => handleClose(toast.id, r)}
        >
          <Alert severity={toast.variant} onClose={() => handleClose(toast.id)}>
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
}
