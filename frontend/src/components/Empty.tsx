import React from "react";
import { Stack, Typography } from "@mui/material";
import { Block } from "@mui/icons-material";
interface Props {
  height?: string | number;
  message?: string;
}
export default function Empty({ height = 100, message = "Empty" }: Props) {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      minHeight={height}
      sx={{
        color: (theme) =>
          theme.palette.mode == "light"
            ? "rgba(0,0,0,.2)"
            : "rgba(255,255,255,.2)",
      }}
    >
      <Block sx={{ fontSize: "5rem" }} />
      <Typography fontSize="h6.fontSize">{message}</Typography>
    </Stack>
  );
}
