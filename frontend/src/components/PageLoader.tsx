import { Backdrop, CircularProgress, Typography } from "@mui/material";
import React from "react";
interface Props {
  message?: string;
}
export default function PageLoader({ message = "Đang tải..." }: Props) {
  return (
    <Backdrop
      open
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: "column",
      }}
    >
      <CircularProgress size="5rem" sx={{ mb: 2 }} />
      <Typography variant="h6">{message}</Typography>
    </Backdrop>
  );
}
