import { Avatar, styled } from "@mui/material";
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: 30,
    height: 30,
  },
}));
export default StyledAvatar;
