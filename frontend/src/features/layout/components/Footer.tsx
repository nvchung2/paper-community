import { Facebook, GitHub, Google } from "@mui/icons-material";
import { Container, IconButton, Typography, styled } from "@mui/material";
import React from "react";
const StyledFooter = styled("footer")(({ theme }) => ({
  padding: theme.spacing(2, 0),
  marginTop: theme.spacing(2),
  border: theme.border,
}));
export default function Footer() {
  return (
    <StyledFooter>
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="body2" color="GrayText">
          Copyright &copy; 2021
        </Typography>
        <div>
          <IconButton>
            <GitHub />
          </IconButton>
          <IconButton>
            <Google />
          </IconButton>
          <IconButton>
            <Facebook />
          </IconButton>
        </div>
      </Container>
    </StyledFooter>
  );
}
