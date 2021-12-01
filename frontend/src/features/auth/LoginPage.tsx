import { Facebook, GitHub, Google } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import config from "config";
const buttons = [
  {
    name: "Github",
    color: "success" as const,
    icon: <GitHub />,
    url: `${config.SERVER_URL}/auth/github`,
  },
  {
    name: "Google",
    color: "error" as const,
    icon: <Google />,
    url: `${config.SERVER_URL}/auth/google`,
  },
  {
    name: "Facebook",
    color: "primary" as const,
    icon: <Facebook />,
    url: `${config.SERVER_URL}/auth/facebook`,
  },
];
export default function LoginPage() {
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Paper sx={{ p: 5, maxWidth: 600 }}>
          <Typography
            textAlign="center"
            variant="h1"
            fontSize="h5.fontSize"
            fontWeight="bold"
          >
            Chào mừng đến với Paper Community
          </Typography>
          <Typography textAlign="center" variant="body1" color="GrayText">
            Paper Community is là một cộng đồng với hơn 1 triệu lập trình viên
          </Typography>
          {buttons.map((btn) => (
            <Button
              key={btn.name}
              sx={{
                mt: 2,
                whiteSpace: "nowrap",
              }}
              color={btn.color}
              startIcon={btn.icon}
              variant="contained"
              fullWidth
              size="large"
              component="a"
              href={btn.url}
            >
              Đăng nhập với {btn.name}
            </Button>
          ))}
        </Paper>
      </Box>
    </>
  );
}
