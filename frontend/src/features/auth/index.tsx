import { Facebook, GitHub, Google } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
const buttons = [
  {
    name: "Github",
    color: "success" as const,
    icon: <GitHub />,
    url: "http://localhost:8080/auth/github",
  },
  {
    name: "Google",
    color: "error" as const,
    icon: <Google />,
    url: "http://localhost:8080/auth/google",
  },
  {
    name: "Facebook",
    color: "primary" as const,
    icon: <Facebook />,
    url: "http://localhost:8080/auth/facebook",
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
            Welcome to Paper Community
          </Typography>
          <Typography textAlign="center" variant="body1" color="GrayText">
            Paper Community is a community of 1 million amazing developers
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
              Login with {btn.name}
            </Button>
          ))}
        </Paper>
      </Box>
    </>
  );
}
