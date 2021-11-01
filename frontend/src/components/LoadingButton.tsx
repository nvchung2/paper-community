import { Button, ButtonProps, CircularProgress } from "@mui/material";
import React from "react";
interface Props extends ButtonProps {
  loading: boolean;
}
export default function LoadingButton({
  loading,
  children,
  startIcon,
  ...props
}: Props) {
  return (
    <Button
      {...props}
      disabled={loading}
      startIcon={loading ? undefined : startIcon}
    >
      {loading && <CircularProgress sx={{ marginRight: 1 }} size="0.8rem" />}
      {children}
    </Button>
  );
}
