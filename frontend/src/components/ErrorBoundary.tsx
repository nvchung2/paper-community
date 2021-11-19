import { Box, Link, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { ErrorResponse } from "lib/http";
import React, { Component } from "react";
export default class ErrorBoundary extends Component<
  {},
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      const error = this.state.error as AxiosError<ErrorResponse>;
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={2}
          height="80vh"
          color={(theme) => theme.palette.error.main}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h1">
              {error.response?.status || "?"}
            </Typography>
          </Box>
          <Typography variant="h6">
            {error.response?.statusText || "Lỗi hệ thống"}
          </Typography>
          <Link href="/" variant="h6">
            Trở về trang chủ
          </Link>
        </Box>
      );
    }
    return this.props.children;
  }
}
